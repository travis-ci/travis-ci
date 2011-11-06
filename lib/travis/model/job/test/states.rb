require 'active_support/concern'
require 'simple_states'

class Job
  class Test
    module States
      extend ActiveSupport::Concern

      included do
        include SimpleStates, Job::States, Travis::Notifications

        states :created, :started, :finished # :cloned, :installed, ...

        event :start,  :to => :started
        event :finish, :to => :finished, :after => :add_tags
        event :all, :after => [:notify, :propagate]

        after_create do
          notify(:create)
        end
      end

      def start(data = {})
        self.started_at = data[:started_at]
      end

      def finish(data = {})
        [:status, :finished_at].each do |key|
          send(:"#{key}=", data[key]) if data.key?(key)
        end
      end

      def append_log!(chars)
        notify(:log, :build => { :_log => chars })
      end

      protected

        def extract_finishing_attributes(attributes)
          extract!(attributes, :finished_at, :status)
        end
    end
  end
end
