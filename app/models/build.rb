require 'core_ext/array/flatten_once'

class Build < ActiveRecord::Base
  belongs_to :repository
  serialize :config

  has_many :children, :class_name => 'Build', :foreign_key => :parent_id

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

  def expand!(config)
    expand_matrix(config).each_with_index do |row, ix|
      Build.create!(attributes.merge(:parent_id => id, :number => "#{number}:#{ix + 1}", :config => row))
    end
  end

  def append_log!(chars)
    update_attributes!(:log => [self.log, chars].join)
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

  def as_json(options = {})
    build_keys = [:id, :number, :commit, :message, :status, :committed_at, :author_name, :author_email, :committer_name, :committer_email]
    build_keys += [:log, :started_at, :finished_at] if options[:full]
    build_methods = []
    super(:only => build_keys, :methods => build_methods, :include => { :repository => { :only => [:id, :name, :url, :last_duration] } })
  end

  protected

    def expand_matrix(config)
      # combines each variable value with it's name, e.g. ['rvm', '1.8.7', '1.9.2']
      # becomes [['rvm', '1.8.7'], ['rvm', '1.9.2']]
      variables = config.inject([]) do |result, values|
        result << values[1..-1].map { |value| [values.first, value] }
      end

      # recursively builds up permutations of values in the rows of a nested array
      matrix = lambda do |*args|
        base, result = args.shift, args.shift || []
        base = base.dup
        base.empty? ? [result] : base.shift.map { |value| matrix.call(base, result + [value]) }.flatten_once
      end

      matrix.call(variables)
    end

end
