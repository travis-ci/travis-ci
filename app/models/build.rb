require 'core_ext/active_record/base'
require 'core_ext/array/flatten_once'
require 'core_ext/hash/compact'
require 'github'

class Build < ActiveRecord::Base
  belongs_to :repository
  belongs_to :parent, :class_name => 'Build', :foreign_key => :parent_id
  has_many :matrix, :class_name => 'Build', :foreign_key => :parent_id, :order => :id

  validates :repository_id, :presence => true

  serialize :config

  before_save :expand_matrix!, :if => :expand_matrix?
  after_save :denormalize_to_repository, :if => :denormalize_to_repository?
  after_save :propagate_status_to_parent, :if => :was_finished?

  class << self
    def create_from_github_payload(payload)
      data       = Github::ServiceHook::Payload.new(JSON.parse(payload))
      repository = Repository.find_or_create_by_github_repository(data.repository)
      number     = repository.builds.next_number
      attributes = data.builds.last.to_hash.merge(:number => number, :github_payload => payload)

      attributes[:branch].match(/gh_pages/i) ? nil : repository.builds.create(attributes)
    end

    def next_number
      maximum(floor('number')).to_i + 1
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
    end
  end

  attr_accessor :log_appended

  def config=(config)
    write_attribute(:config, normalize_config(config))
  end

  def log_appended?
    log_appended.present?
  end

  def append_log!(chars)
    self.log_appended = chars
    update_attributes!(:log => [self.log, chars].join)
  end

  def started?
    started_at.present?
  end

  def was_started?
    started? && (started_at_changed? || @previously_changed.keys.include?('started_at'))
  end

  def finished?
    finished_at.present?
  end

  def was_finished?
    finished? && (finished_at_changed? || @previously_changed.keys.include?('finished_at'))
  end

  def pending?
    !finished?
  end

  def passed?
    status == 0
  end

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  def matrix?
    parent_id.blank? && matrix_config?
  end

  def matrix_expanded?
    Travis::Buildable::Config.matrix?(@previously_changed['config'][1]) rescue false # TODO how to use some public AR API?
  end

  def update_matrix_status!
    update_attributes!(:status => matrix.map(&:status).include?(1) ? 1 : 0, :finished_at => Time.now) if matrix.all?(&:finished?)
  end

  all_attrs = [:id, :repository_id, :parent_id, :number, :commit, :branch, :message, :status, :log, :started_at, :finished_at,
    :committed_at, :committer_name, :committer_email, :author_name, :author_email, :config]

  JSON_ATTRS = {
    :default          => all_attrs,
    :job              => [:id, :number, :commit, :config],
    :'build:queued'   => [:id, :number],
    :'build:started'  => all_attrs - [:status, :log, :finished_at],
    :'build:expanded' => [:id, :parent_id, :number, :config],
    :'build:log'      => [:id, :parent_id],
    :'build:finished' => [:id, :parent_id, :status, :finished_at],
  }

  def as_json(options = nil)
    options ||= {}
    json = super(:only => JSON_ATTRS[options[:for] || :default])
    json.merge!('matrix' => matrix.as_json(:for => options[:for])) if matrix?
    json.compact
  end

  def send_notifications?
    notifications_enabled? && parent_finished?
  end

  protected

    def notifications_enabled?
      !(self.config && self.config['notifications'] && config['notifications']['disabled'])
    end

    def parent_finished?
      !self.parent || self.parent.finished?
    end

    def expand_matrix?
      matrix? && matrix.empty?
    end

    def expand_matrix!
      expand_matrix_config(matrix_config.to_a).each_with_index do |row, ix|
        matrix.build(attributes.merge(:number => "#{number}.#{ix + 1}", :config => config.merge(Hash[*row.flatten]), :log => ''))
      end
    end

    def matrix_config?
      matrix_config.present?
    end

    def matrix_config
      @matrix_config ||= begin
        config = self.config || {}
        keys   = Travis::Buildable::Config::ENV_KEYS & config.keys
        size   = config.slice(*keys).values.select { |value| value.is_a?(Array) }.max { |lft, rgt| lft.size <=> rgt.size }.try(:size) || 1

        keys.inject([]) do |result, key|
          values = config[key]
          values = [values] unless values.is_a?(Array)
          values += [values.last] * (size - values.size) if values.size < size
          result << values.map { |value| [key, value] }
        end if size > 1
      end
    end

    def expand_matrix_config(config)
      # recursively builds up permutations of values in the rows of a nested array
      matrix = lambda do |*args|
        base, result = args.shift, args.shift || []
        base = base.dup
        base.empty? ? [result] : base.shift.map { |value| matrix.call(base, result + [value]) }.flatten_once
      end
      matrix.call(config).uniq
    end

    def denormalize_to_repository?
      parent_id.blank? && changed & %w(number status started_at finished_at)
    end

    def denormalize_to_repository
      repository.update_attributes!(
        :last_build_id => id,
        :last_build_number => number,
        :last_build_status => status,
        :last_build_started_at => started_at,
        :last_build_finished_at => finished_at
      )
    end

    def propagate_status_to_parent
      parent.update_matrix_status! if was_finished? && parent
    end

    def normalize_config(config)
      Travis::Buildable::Config::ENV_KEYS.inject(config) do |config, key|
        config[key] = config[key].values if config[key].is_a?(Hash)
        config
      end
    end
end
