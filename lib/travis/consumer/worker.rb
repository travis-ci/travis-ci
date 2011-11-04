module Travis
  class Consumer
    class Worker < Handler
      attr_accessor :event, :payload

      def initialize(event, payload)
        @event = event
        @payload = Hashr.new(payload)
      end

      def handle
        case event.to_sym
        when :'worker:ping'
          worker.ping!
        else
          worker.set_state(event.to_s.split(':').last)
        end
      end

      protected

        def worker
          @worker ||= ::Worker.find_or_create_by_name_and_hostname(:name => payload.name, :hostname => payload.hostname)
        end
    end
  end
end
