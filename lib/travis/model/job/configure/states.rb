require 'active_support/concern'
require 'simple_states'

class Job
  class Configure
    module States
      extend ActiveSupport::Concern

      included do
        include SimpleStates, Job::States, Travis::Notifications

        states :created, :started, :finished

        event :start,  :to => :started,  :after => :propagate
        event :finish, :to => :finished, :after => :configure_owner # TODO why not just propagate here?
        event :all, :after => :notify

        after_create do
          notify(:create)
        end

        def finish(data)
          [:config, :status, :finished_at].each do |key|
            send(:"#{key}=", data[key]) if data.key?(key)
          end
        end

        def configure_owner(event, data)
          owner.configure!(data)
        end

        protected

          def extract_finishing_attributes(attributes)
            extract!(attributes, :config)
          end
      end
    end
  end
end
