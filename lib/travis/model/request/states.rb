require 'active_support/concern'
require 'simple_states'

class Request
  module States
    extend ActiveSupport::Concern

    included do
      include SimpleStates, Branches

      states :created, :started, :finished
      event :start,     :to => :started
      event :configure, :to => :configured, :after => :finish
      event :finish,    :to => :finished

      def approved?
        branch_included?(commit.branch) && !branch_excluded?(commit.branch)
      end

      def configure(data)
        update_attributes!(extract_attributes(data))
        create_build! if approved?
      end

      protected

        def extract_attributes(attributes)
          attributes.symbolize_keys.slice(*attribute_names.map(&:to_sym))
        end
    end
  end
end
