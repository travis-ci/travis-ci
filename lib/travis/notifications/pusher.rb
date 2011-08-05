module Travis
  module Notifications
    class Pusher
      EVENTS = [/build:/, /task:/]

      def notify(event, object, *args)
        push(event, json_for(event, object)) # TODO gotta figure out incremental log updates. was: .deep_merge(data)
      end

      protected

        def push(event, data)
          Pusher[event == 'build:queued' ? 'jobs' : 'repositories'].trigger(event, data)
        end

        def json_for(event, build)
          { 'build' => build.as_json(:for => event.to_sym), 'repository' => build.repository.as_json(:for => event.to_sym) }
        end
    end
  end
end
