module Travis
  class Consumer
    class Job < Handler
      def handle
        case event.to_sym
        when :'job:test:log'
          handle_log_update
        else
          handle_update
        end
      end

      protected

        def job
          @job ||= ::Job.find(payload.id)
        end

        def handle_update
          job.update_attributes(payload.to_hash)
        end

        def handle_log_update
          ::Job::Test.append_log!(payload.id, payload.log)
        end
    end
  end
end
