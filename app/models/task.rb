class Task < ActiveRecord::Base
  include SimpleStates

  event :all, :after => :notify

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_create do
    notify(:created, self) # TODO this really should be in simple_states, but will probably require some AR hackery
  end

  def propagate(*args)
    owner.send(*args)
  end

  def notify(*args)
    event = args.shift # TODO maybe a simple_states bug? can't add event to the signature.
    Travis::Notifications.dispatch(namespace(event, self), self, *args)
  end

  protected

    def namespace(event, object)
      [object.class.name.underscore.gsub('/', ':'), event.to_s].join(':')
    end
end
