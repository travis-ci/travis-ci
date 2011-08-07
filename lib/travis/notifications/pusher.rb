module Travis
  module Notifications
    class Pusher
      EVENTS = [/build:/, /task:/]

      def notify(event, object, *args)
        push(event, hash_for(event, build)) # TODO gotta figure out incremental log updates. was: .deep_merge(data)
      end

      protected

        def push(event, data)
          Pusher[event == 'build:queued' ? 'jobs' : 'repositories'].trigger(event, data)
        end

        def hash_for(event, build)
          data = { 'build' => build, 'repository' => build.repository }
          Travis.hash(data, :type => :event, :template => "build_#{event}/build")
        end
    end
  end
end
