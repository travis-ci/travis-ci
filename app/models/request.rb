class Request < ActiveRecord::Base
  include SimpleStates
  states :created, :started, :finished
  event :start,  :to => :started
  event :configure, :to => :configured, :after => :create_build, :unless => :rejected?

  has_one :task, :as => :owner

  serialize :config

  def initialize(*)
    super
    @state = :created
  end

  after_create do
    self.task = Task::Configure.new
  end

  def configure(config)
    self.config = config
  end

  def create_build
    # create build
  end

  def rejected?
    false
  end
end
