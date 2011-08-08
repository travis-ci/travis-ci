require 'core_ext/active_record/base'

class Build < ActiveRecord::Base
  include Matrix, Notifications, SimpleStates, Travis::Notifications

  states :created, :started, :finished

  event :start,  :to => :started
  event :finish, :to => :finished, :if => :matrix_finished?
  event :all, :after => :denormalize # TODO bug in simple_states. should be able to pass an array

  belongs_to :commit
  belongs_to :request
  belongs_to :repository, :autosave => true
  has_many   :matrix, :as => :owner, :order => :id, :class_name => 'Task::Test'

  validates :repository_id, :commit_id, :request_id, :presence => true

  serialize :config

  class << self
    def recent(page)
      was_started.descending.limit(10 * page).includes(:matrix) # TODO should use an offset when we use limit!
    end

    def was_started
      where(:state => ['started', 'finished'])
    end

    def finished
      where(:state => 'finished')
    end

    def on_branch(branches)
      joins(:commit).where(["commits.branch IN (?)", branches])
    end

    def descending
      order(arel_table[:id].desc)
    end

    def next_number
      maximum(floor('number')).to_i + 1
    end
  end

  after_initialize do
    self.config = {} if config.nil?
  end

  before_create do
    self.number = self.class.next_number
    expand_matrix
  end

  def config=(config)
    super(config.deep_symbolize_keys)
  end

  def finish(attributes)
    self.status = attributes[:status]
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

  protected

    def denormalize(*args)
      event = args.first # TODO bug in simple_state? getting an error when i add this to the method signature
      repository.update_attributes!(denormalize_attributes_for(event)) # if denormalize?(event)
      notify(*args)
    end

    DENORMALIZE = {
      :start  => %w(id number started_at),
      :finish => %w(status finished_at)
    }

    def denormalize?(event)
      DENORMALIZE.key?(event)
    end

    def denormalize_attributes_for(event)
      DENORMALIZE[event].inject({}) do |result, key|
        result.merge(:"last_build_#{key}" => send(key))
      end
    end
end
