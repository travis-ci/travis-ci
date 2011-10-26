module Travis
  class Model
    class Job
      class Configure < Job
        states :created, :started, :finished

        event :start,  :to => :started,  :after => :propagate
        event :finish, :to => :finished, :after => :configure_owner # TODO why not just propagate here?

        def finish(data)
          record.config = data[:config]
        end

        def configure_owner(event, config)
          owner.configure!(config)
        end

        protected

          def extract_finishing_attributes(attributes)
            extract!(attributes, :config)
          end

          def owner_class
            Request
          end
      end
    end
  end
end
