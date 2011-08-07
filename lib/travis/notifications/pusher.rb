module Travis
  module Notifications
    class Pusher
      EVENTS = [/build:/, /task:/]

      def notify(event, object, *args)
        push(event, object, *args)
      end

      protected

        def push(event, object, *args)
          data = args.last.is_a?(Hash) ? args.pop : {}
          data = data_for(event, object).deep_merge(data)
          channel(event).trigger(event, data)
        end

        def channel(event)
          ::Pusher[queue_for(event)]
        end

        def queue_for(event)
          event.starts_with?('task:') ? 'jobs' : 'repositories'
        end

        def data_for(event, object)
          data = { 'build' => object, 'repository' => object.repository }
          dir  = event.split(':').tap { |tokens| tokens.slice!(1..-2) if tokens.size > 2 }.join('_')
          Travis.hash(data, :type => "event/#{dir}")
        end

        def template_dir(event, object)
          tokens = event.split(':')
          tokens.slice!(1..-2) if tokens.size > 2
          tokens.join('_')
        end
    end
  end
end
