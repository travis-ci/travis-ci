class Task < ActiveRecord::Base
  include SimpleStates

  class << self
    def append_log!(id, chars)
      task = find(id, :select => [:id, :repository_id, :owner_id, :state], :include => :repository)
      task.append_log!(chars) unless task.finished?
    end
  end

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_create do
    notify(:created, self) # TODO this really should be in simple_states, but will probably require some AR hackery
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", id])
    notify(:log, :log => chars)
  end

  def propagate(*args)
    owner.send(*args)
  end

  def notify(*args)
    event = args.shift # TODO maybe a simple_states bug? can't add event to the signature.
    Travis::Notifications.dispatch(client_event(event, self), self, *args)
  end

  protected

    def client_event(event, object)
      event = "#{event}ed" unless event == :log
      ['build', event].join(':') # later: object.class.name.demodulize.underscore
    end
end
