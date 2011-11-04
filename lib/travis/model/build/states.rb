require 'active_support/concern'
require 'simple_states'

class Build
  module States
    extend ActiveSupport::Concern

    included do
      include SimpleStates, Denormalize, Notifications, Travis::Notifications

      states :created, :started, :finished

      event :start,  :to => :started
      event :finish, :to => :finished, :if => :matrix_finished?
      event :all, :after => [:denormalize, :notify]
    end

    def start(data = {})
      self.started_at = data[:started_at]
    end

    def finish(data = {})
      self.status = matrix_status
      self.finished_at = data[:finished_at]
    end

    def pending?
      !finished?
    end

    def passed?
      status == 0
    end

    def failed?
      !passed?
    end

    def color
      pending? ? 'yellow' : passed? ? 'green' : 'red'
    end
  end
end
