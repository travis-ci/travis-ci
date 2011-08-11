require 'core_ext/active_record/base'

class Build < ActiveRecord::Base
  cattr_accessor :sources
  self.sources = []

  include Branches, Events, Json, Matrix, Notifications, Sources::Github

  ENV_KEYS = ['rvm', 'gemfile', 'env', 'otp_release']

  belongs_to :repository
  belongs_to :parent, :class_name => 'Build', :foreign_key => :parent_id
  has_many   :matrix, :class_name => 'Build', :foreign_key => :parent_id, :order => :id

  validates :repository_id, :presence => true

  serialize :config

  class << self
    def recent(page)
      page = (page || 1).to_i
      started.order('id DESC').limit(10 * page).includes(:matrix)
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
    end

    def next_number
      maximum(floor('number')).to_i + 1
    end

    def exclude?(attributes)
      sources.any? { |source| source.exclude?(attributes) }
    end

    def keys_for(hash)
      ENV_KEYS.select { |key| hash.keys.map(&:to_s).include?(key) }
    end

  end

  def config=(config)
    write_attribute(:config, normalize_config(config))
  end

  def append_log!(chars)
    self.class.update_all(["log = COALESCE(log, '') || ?", chars], ["id = ?", self.id])
  end

  def approved?
    branch_included? || !branch_excluded?
  end

  def configured?
    config.present?
  end

  def started?
    started_at.present?
  end

  def finished?
    finished_at.present?
  end

  def pending?
    !finished?
  end

  def passed?
    status == 0
  end

  def status_message
    passed? ? 'Passed' : 'Failed'
  end

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  # Return only the child builds whose config matches against as passed hash
  # e.g. build.matrix_for(rvm: '1.8.7', env: 'DB=postgresql')
  def matrix_for(hash)
    matrix.select do |build|
      Build.keys_for(hash).map do |key|
        build.config[key] == hash[key]
      end.inject(:&)
    end
  end

  protected

    def normalize_config(config)
      ENV_KEYS.inject(config.to_hash) do |config, key|
        config[key] = config[key].values if config[key].is_a?(Hash)
        config
      end
    end
end
