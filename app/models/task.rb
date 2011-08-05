class Task < ActiveRecord::Base
  include SimpleStates

  event :all, :after => :notify

  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :owner_id, :owner_type, :presence => true

  after_create do
    enqueue
  end

  def propagate(*args)
    owner.send(*args)
  end

  def notify(*args)
    # Travis::Notifications.dispatch(namespace(event, self), self, *args)
  end

  protected

    def enqueue
      Travis::Worker.enqueue(self)
    end

    def namespace(event, object)
      [object.class.name.underscore.gsub('::', ':'), event.to_s].join(':')
    end
end
