class Task < ActiveRecord::Base
  include SimpleStates, Travis::Notifications

  class << self
    def append_log!(id, chars)
      # TODO using find here (on the base class) would not instantiate the model as an STI model? I.e. with the given type?
      # might need to set this class abstract for that?
      task = Task::Test.find(id, :select => [:id, :repository_id, :owner_id, :owner_type, :state], :include => :repository)
      task.append_log!(chars) unless task.finished?
    end
  end

  event :all, :after => :notify

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_initialize do
    self.config = {} if config.nil?
  end

  after_create do
    notify(:create) # TODO this really should be in simple_states, but will probably require some AR hackery
  end

  def update_attributes *args
    build_attributes = args.first["build"]
    if build_attributes["started_at"]
      self.start!
    elsif build_attributes["finished_at"]
      self.finish! build_attributes.slice(:status)
    end
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", id])
    owner.notify(:log, :log => chars)
  end

  def propagate(*args)
    owner.send(*args)
  end
end
