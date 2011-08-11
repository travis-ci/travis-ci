module Travis
  module Notifications
    class Pusher
      EVENTS = [/build:/, /task:.*:(created|finished)/]

      class Payload
        attr_reader :event, :object, :extra

        def initialize(event, object, extra = {})
          @event, @object, @extra = event, object, extra
        end

        def to_hash
          render(:hash)
        end

        def render(format)
          Travis.send(format, data, :type => :event, :template => template).first.deep_merge(extra) # TODO wtf is this an array??
        end

        def data
          { :build => object, :repository => object.repository }
        end

        def template
          event.to_s.split(':').join('/')
        end
      end

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
          case event
          when /task:.*:created/
            'build:queued'
          when /task:.*:finished/
            'build:removed'
          else
            event
          end
        end

        def queue_for(event)
          event.starts_with?('task:') ? 'jobs' : 'repositories'
        end

        def payload_for(event, object, extra = {})
          Payload.new(client_event_for(event), object, extra).to_hash
        end
    end
  end
end
