module Travis
  class Model
    class Job
      class Test < Job
        include Tagging

        class << self
          def append_log!(id, chars)
            job = new(::Job.find(id, :select => [:id, :repository_id, :owner_id, :owner_type, :state], :include => :repository))
            job.append_log!(chars) unless job.finished?
          end
        end

        states :created, :started, :finished # :cloned, :installed, ...

        event :start,  :to => :started, :after => :propagate
        event :finish, :to => :finished, :after => [:add_tags, :propagate]

        def start(data = {})
          record.started_at = data[:started_at]
        end

        def finish(data = {})
          record.status, record.finished_at = *data.values_at(:status, :finished_at)
        end

        def append_log!(chars)
          record.append_log!(chars)
          notify(:log, :build => { :_log => chars })
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
