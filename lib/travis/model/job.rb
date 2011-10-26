require 'simple_states'
require 'active_support/core_ext/object/blank'
require 'active_support/core_ext/hash/except'

module Travis
  class Model
    class Job < Model
      autoload :Configure, 'travis/model/job/configure'
      autoload :Tagging,   'travis/model/job/tagging'
      autoload :Test,      'travis/model/job/test'

      class << self
        def append_log!(id, chars)
          # TODO using find here (on the base class) would not instantiate the model as an STI model with the given type?
          task = new(::Job.find(id, :select => [:id, :repository_id, :owner_id, :owner_type, :state], :include => :repository))
          task.append_log!(chars) unless task.finished?
        end
      end

      include SimpleStates, Travis::Notifications

      event :all, :after => :notify

      delegate :config, :log, :state, :state=, :finished?, :to => :record

      def owner
        @owner ||= owner_class.new(record.owner)
      end

      def propagate(*args)
        owner.send(*args)
      end

      def append_log!(chars)
        record.append_log!(chars)
        notify(:log, :build => { :_log => chars })
      end

      def update_attributes(attributes)
        update_states(attributes.deep_symbolize_keys)
        record.update_attributes(attributes)
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
end
