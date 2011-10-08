module Travis
  class Consumer
    class Task
      attr_reader :payload

      def handle(event, payload)
        @payload = payload

        case event.to_sym
        when :'job:test:log'
          handle_log_update
        else
          handle_update
        end
      end

      protected

        def handle_update
          task = ::Task.find(payload.id)
          task.update_attributes(payload.to_hash)
        end

        def handle_log_update
          ::Task.append_log!(payload.id, payload.log)
        end
    end
  end
end
