require 'core_ext/array/flatten_once'

class Build < ActiveRecord::Base
  belongs_to :repository
  belongs_to :parent, :class_name => 'Build', :foreign_key => :parent_id

  has_many :matrix, :class_name => 'Build', :foreign_key => :parent_id

  validates :repository_id, :presence => true

  serialize :config

  before_save :expand_matrix!, :if => :expand_matrix?
  after_save :denormalize_to_repository, :if => :denormalize_to_repository?

  class << self
    def create_from_github_payload(data)
      repository = Repository.find_or_create_by_url(data['repository']['url'])
      commit     = data['commits'].last
      author     = commit['author'] || {}
      committer  = commit['committer'] || author || {}

      repository.builds.create(
        :commit          => commit['id'],
        :message         => commit['message'],
        :number          => repository.builds.count + 1,
        :committed_at    => commit['timestamp'],
        :committer_name  => committer['name'],
        :committer_email => committer['email'],
        :author_name     => author['name'],
        :author_email    => author['email']
      )
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
    end
  end

  def append_log!(chars)
    update_attributes!(:log => [self.log, chars].join)
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

  def color
    pending? ? '' : passed? ? 'green' : 'red'
  end

  def matrix?
    parent_id.blank? && matrix_config?
  end

  def matrix_expanded?
    Travis::Buildable::Config.matrix?(@previously_changed['config'][1]) rescue false # TODO how to use some public AR API?
  end

  def as_json(options = nil)
    options ||= {}
    json = super(:except => [:created_at, :updated_at, :agent, :job_id])
    json.merge!(:repository => repository.as_json(:for => :build)) if options[:for] == :event
    json.merge!(:matrix => matrix.as_json(:only => [:config], :for => :build)) if matrix?
    json
  end

  protected

    def denormalize_to_repository?
      repository.last_build == self && changed & %w(number status started_at finished_at)
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

    def expand_matrix?
      matrix? && matrix.empty?
    end

    def expand_matrix!
      expand_matrix_config(matrix_config.to_a).each_with_index do |row, ix|
        matrix.build(attributes.merge(:number => "#{number}.#{ix + 1}", :config => Hash[*row.flatten]))
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
      matrix.call(config)
    end

end
