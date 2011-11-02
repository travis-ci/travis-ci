require 'active_support/core_ext/object/blank'
require 'active_support/core_ext/hash/except'

class Job
  module States
    def propagate(*args)
      owner.send(*args)
      true
    end

    def update_attributes(attributes)
      if content = attributes.delete(:log)
        log.update_attributes(:content => content)
      end
      update_states(attributes.deep_symbolize_keys)
      super
    end

    def passed?
      status == 0
    end

    def failed?
      status == 1
    end

    def unknown?
      status == nil
    end

    protected

      # extracts attributes like :started_at, :finished_at, :config from the given attributes and triggers
      # state changes based on them. See the respective `extract_[state]ing_attributes` methods.
      def update_states(attributes)
        [:start, :finish].each do |state|
          state_attributes = send(:"extract_#{state}ing_attributes", attributes)
          send(:"#{state}!", state_attributes) if state_attributes.present?
        end
      end

      def extract_starting_attributes(attributes)
        extract!(attributes, :started_at)
      end

      def extract!(hash, *keys)
        # arrrgh. is there no ruby or activesupport hash method that does this?
        hash.slice(*keys).tap { |result| hash.except!(*keys) }
      rescue KeyError
        {}
      end
  end
end


