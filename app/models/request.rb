class Request < ActiveRecord::Base
  include SimpleStates, Branches, Github

  states :created, :started, :finished
  event :start,     :to => :started
  event :configure, :to => :configured, :after => :finish
  event :finish,    :to => :finished

  has_one    :task, :as => :owner, :class_name => 'Task::Configure'
  belongs_to :commit
  belongs_to :repository
  has_many   :builds

  validates :repository_id, :commit_id, :presence => true

  serialize :config

  before_create do
    self.build_task(:repository => self.repository, :commit => self.commit)
  end

  def configure(data)
    self.config = normalize_config(data[:config] || {})
    builds.create!(:repository => repository, :commit => commit, :config => self.config) if approved?
  end

  def approved?
    branch_included? && !branch_excluded?
  end

  protected

    # TODO move this closer to the entry point of this data? will this be required with amqp at all?
    def normalize_config(config)
      Build::Matrix::ENV_KEYS.inject(config.to_hash.deep_symbolize_keys) do |config, key|
        config[key] = config[key].values if config[key].is_a?(Hash)
        config
      end
    end
end
