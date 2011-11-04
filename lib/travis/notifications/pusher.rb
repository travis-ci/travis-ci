require 'pusher'

module Travis
  module Notifications
    class Pusher
      autoload :Payload, 'travis/notifications/pusher/payload'

      EVENTS = [/build:(started|finished)/, /job:.*:(created|started|log|finished)/]

      def notify(event, object, *args)
        push(event, object, *args)
      end

      protected

        def push(event, object, *args)
          data  = args.last.is_a?(Hash) ? args.pop : {}
          data  = payload_for(event, object, data)
          event = client_event_for(event)
          channel(event, object).trigger(event, data)
        end

        def config
          @config ||= Travis.config.pusher
        end

        def pusher
          @pusher ||= ::Pusher.tap do |pusher|
            pusher.app_id = config.app_id
            pusher.key    = config.key
            pusher.secret = config.secret
          end
        end

        def channel(event, object)
          pusher[queue_for(event, object)]
        end

        def client_event_for(event)
          # gotta remap a bunch of events here. should get better with sproutcore
          case event
          when /job:.*:created/
            'build:queued'
          when 'job:configure:started', # TODO doesn't seem to be sent by the worker, so we notify on finished, too
               'job:configure:finished'
            'build:removed'
          when 'job:test:started'
            'build:removed'
          when 'job:test:finished'
            'build:finished'
          when 'job:test:log'
            'build:log'
          else
            event
          end
        end

        def queue_for(event, object)
          case event
          when 'build:queued', 'build:removed'
            'jobs'
          when 'build:log'
            "build-#{object.id}"
          else
            'builds'
          end
        end

        def payload_for(event, object, extra = {})
          Payload.new(client_event_for(event), object, extra).to_hash
        end
    end
  end
end
