class Task < ActiveRecord::Base
  include SimpleStates, Travis::Notifications

  class << self
    def append_log!(id, chars)
      task = find(id, :select => [:id, :repository_id, :owner_id, :owner_type, :state], :include => :repository)
      task.append_log!(chars) unless task.finished?
    end
  end

  event :all, :after => :notify

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_create do
    notify(:create) # TODO this really should be in simple_states, but will probably require some AR hackery
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", id])
    owner.notify(:log, :log => chars)
  end

  def propagate(*args)
    owner.send(*args)
  end
end
