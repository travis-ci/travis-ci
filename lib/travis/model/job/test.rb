module Travis
  class Model
    class Job
      class Test < Job
        include Tagging

        states :created, :started, :finished # :cloned, :installed, ...

        event :start,  :to => :started, :after => :propagate
        event :finish, :to => :finished, :after => [:add_tags, :propagate]

        def start(data = {})
          record.started_at = data[:started_at]
        end

        def finish(data = {})
          record.status, record.finished_at = *data.values_at(:status, :finished_at)
        end

        protected

          def extract_finishing_attributes(attributes)
            extract!(attributes, :finished_at, :status)
          end

          def owner_class
            Build
          end
      end
    end
  end
end
