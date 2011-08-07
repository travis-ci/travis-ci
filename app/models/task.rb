class Task < ActiveRecord::Base
  include SimpleStates

  event :all, :after => :notify

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_create :enqueue

  def propagate(*args)
    owner.send(*args)
  end

  def notify(*args)
    # Travis::Notifications.dispatch(namespace(event, self), self, *args)
  end

  all_attrs = [:id, :repository_id, :number, :config, :state, :status, :started_at, :finished_at]

  # all_attrs = [:log]

  JSON_ATTRS = {
    :default            => all_attrs,
    :build              => all_attrs,
    :job                => [:id, :number, :commit, :config, :branch],
    :'build:queued'     => [:id, :number],
    :'build:removed'    => [:id, :number],
    :'build:log'        => [:id, :parent_id],
  }

  def as_json(options = nil)
    options ||= {}
    json = super(:only => JSON_ATTRS[options[:for] || :default])
    json.merge!(commit.as_json(:for => options[:for]))
    json.merge!('parent_id' => owner.id) unless options[:for]
    json.compact
  end

  protected

    def enqueue
      Travis::Worker.enqueue(self)
    end

    def namespace(event, object)
      [object.class.name.underscore.gsub('::', ':'), event.to_s].join(':')
    end
end
