module Travis
  module Notifications
    class Pusher
      autoload :Payload, 'travis/notifications/pusher/payload'

      EVENTS = [/build:.*/, /task:.*:(created|started|log|finished)/]

      def notify(event, object, *args)
        push(event, object, *args)
      end

      protected

        def push(event, object, *args)
          data = args.last.is_a?(Hash) ? args.pop : {}
          data = payload_for(event, object, data)
          channel(event).trigger(client_event_for(event), data)
        end

        def channel(event)
          ::Pusher[queue_for(event)]
        end

        def client_event_for(event)
          # gotta remap a bunch of events here. should get better with sproutcore
          case event
          when /task:.*:created/
            'build:queued'
          when 'task:configure:started', # TODO doesn't seem to be sent by the worker, so we notify on finished, too
               'task:configure:finished'
            'build:removed'
          when 'task:test:started'
            'build:removed'
          when 'task:test:finished'
            'build:finished'
          when 'task:test:log'
            'build:log'
          else
            event
          end
        end

        def queue_for(event)
          event.starts_with?('task:') ? 'jobs' : 'repositories' # TODO not quite true ...
        end

        def payload_for(event, object, extra = {})
          Payload.new(client_event_for(event), object, extra).to_hash
        end
    end
  end
end
