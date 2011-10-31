require 'active_record'

class Job < ActiveRecord::Base
  autoload :Configure, 'travis/record/job/configure'
  autoload :Test,      'travis/record/job/test'

  belongs_to :repository
  belongs_to :commit
  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :repository_id, :commit_id, :owner_id, :owner_type, :presence => true

  serialize :config

  after_initialize do
    self.config = {} if config.nil?
  end

  def started?
    state == :started
  end

  def finished?
    state == :finished
  end

  def passed?
    status == 0
  end

  def failed?
    status == 1
  end

  def unknown?
    status == nil
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", id])
  end

  def matrix_config?(config)
    config = config.to_hash.symbolize_keys
    Build.matrix_keys_for(config).map do |key|
      self.config[key.to_sym] == config[key] || commit.branch == config[key]
    end.inject(:&)
  end
end
