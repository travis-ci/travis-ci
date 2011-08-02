require 'core_ext/active_record/base'

class Build < ActiveRecord::Base
  include SimpleStates, Matrix, Notifications
  # include Events, Json

  states :created, :started, :finished

  event :start,  :to => :started
  event :finish, :to => :finished, :if => :matrix_finished?

  belongs_to :commit
  belongs_to :repository
  belongs_to :request
  has_many   :matrix, :class_name => 'Task::Test', :order => :id, :as => :owner

  validates :repository_id, :commit_id, :request_id, :presence => true

  class << self
    def recent(page)
      started.order('id DESC').limit(10 * page).includes(:matrix)
    end

    def started
      where(arel_table[:started_at].not_eq(nil))
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
  end

  def finish(status)
    self.status = status
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
end
