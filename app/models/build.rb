require 'core_ext/active_record/base'
require 'core_ext/array/flatten_once'
require 'core_ext/hash/compact'
require 'github'

class Build < ActiveRecord::Base
  ENV_KEYS = ['rvm', 'gemfile', 'env']

  belongs_to :repository
  belongs_to :parent, :class_name => 'Build', :foreign_key => :parent_id
  has_many :matrix, :class_name => 'Build', :foreign_key => :parent_id, :order => :id

  validates :repository_id, :presence => true

  serialize :config

  before_save :expand_matrix!, :if => :expand_matrix?
  after_save :was_started,     :if => :was_started?
  after_save :was_finished,    :if => :was_finished?

  class << self
    def create_from_github_payload(payload)
      data = Github::ServiceHook::Payload.new(payload)

      return false if data.repository.private?

      repository = Repository.find_or_create_by_github_repository(data.repository)
      number     = repository.builds.next_number
      build      = data.builds.last

      if build
        attributes = build.to_hash.merge(:number => number, :github_payload => payload, :compare_url => data.compare)
        repository.builds.create(attributes) unless exclude?(attributes)
      end
    end

    def next_number
      maximum(floor('number')).to_i + 1
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
    end

    def exclude?(attributes)
      attributes.key?(:branch) && attributes[:branch].match(/gh[-_]pages/i)
    end

    def matrix?(config)
      config.values_at(*ENV_KEYS).compact.any? { |value| value.is_a?(Array) && value.size > 1 }
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

  def configured?
    config.present?
  end

  def finished?
    finished_at.present?
  end

  def was_started?
    started? && (started_at_changed? || @previously_changed.keys.include?('started_at'))
  end

  def was_configured?
    configured? && (config_changed? || @previously_changed.keys.include?('config'))
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

  def status_message
    passed? ? 'Passed' : 'Failed'
  end

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  def matrix?
    parent_id.blank? && matrix_config?
  end

  def matrix_expanded?
    self.class.matrix?(@previously_changed['config'][1]) rescue false # TODO how to use some public AR API?
  end

  def matrix_status
    matrix.map(&:status).include?(1) ? 1 : 0 if matrix? && matrix.all?(&:finished?)
  end

  all_attrs = [:id, :repository_id, :parent_id, :number, :commit, :branch, :message, :status, :log, :started_at, :finished_at,
    :committed_at, :committer_name, :committer_email, :author_name, :author_email, :config]

  JSON_ATTRS = {
    :default            => all_attrs,
    :job                => [:id, :number, :commit, :config],
    :'build:queued'     => [:id, :number],
    :'build:started'    => all_attrs - [:status, :log, :finished_at],
    :'build:configured' => [:id, :parent_id, :number, :config],
    :'build:log'        => [:id, :parent_id],
    :'build:finished'   => [:id, :parent_id, :status, :finished_at],
  }

  def as_json(options = nil)
    options ||= {}
    json = super(:only => JSON_ATTRS[options[:for] || :default])
    json.merge!('matrix' => matrix.as_json(:for => options[:for])) if matrix?
    json.compact
  end

  def send_notifications?
    notifications_enabled? && matrix_finished? && unique_recipients.present?
  end

  # at some point we might want to move this to a Notifications manager that abstracts email and other types of notifications
  def unique_recipients
    @unique_recipients ||= if config && notifications = config['notifications']
      notifications['recipients']
    else
      recipients = [committer_email, author_email, repository.owner_email]
      recipients.select(&:present?).join(',').split(',').map(&:strip).uniq.join(',')
    end
  end

  protected

    def notifications_enabled?
      !(self.config && self.config['notifications'] && config['notifications']['disabled'])
    end

    def matrix_finished?
      parent ? parent.finished? : finished?
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
        keys   = ENV_KEYS & config.keys
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

    def was_started
      if parent
        parent.update_attributes!(:started_at => started_at)
        denormalize_to_repository(parent)
      else
        denormalize_to_repository(self)
      end
    end

    def was_finished
      if parent
        parent.update_attributes!(:status => parent.matrix_status, :finished_at => Time.now) if parent
        denormalize_to_repository(parent)
      else
        denormalize_to_repository(self)
      end
    end

    def denormalize_to_repository(build)
      repository.update_attributes!(
        :last_build_id => build.id,
        :last_build_number => build.number,
        :last_build_status => build.status,
        :last_build_started_at => build.started_at,
        :last_build_finished_at => build.finished_at
      )
    end

    def normalize_config(config)
      ENV_KEYS.inject(config.to_hash) do |config, key|
        config[key] = config[key].values if config[key].is_a?(Hash)
        config
      end
    end
end
