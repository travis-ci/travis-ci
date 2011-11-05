require 'active_record'

class Job < ActiveRecord::Base
  autoload :Configure,  'travis/model/job/configure'
  autoload :Tagging,    'travis/model/job/tagging'
  autoload :Requeueing, 'travis/model/job/requeueing'
  autoload :States,     'travis/model/job/states'
  autoload :Test,       'travis/model/job/test'

  include Requeueing

  has_one    :log, :class_name => "Artifact::Log", :conditions => { :type => "Artifact::Log" }
  has_many   :artifacts
  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_initialize do
    self.config = {} if config.nil?
  end

  before_create do
    build_log
  end

  def matrix_config?(config)
    config = config.to_hash.symbolize_keys
    Build.matrix_keys_for(config).map do |key|
      self.config[key.to_sym] == config[key] || commit.branch == config[key]
    end.inject(:&)
  end
end
