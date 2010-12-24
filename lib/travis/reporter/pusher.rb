require 'json'

module Travis
  module Reporter
    module Pusher
      def on_start
        super
        push 'build:started', :build => build
      end

      def on_log(log)
        super
        push 'build:log', :build => { :id => build['id'], :repository => { :id => build['repository']['id'] } }, :log => log
      end

      def on_finish
        super
        push 'build:finished', :build => build
      end

      protected

        def push(event, data)
          channel = :"repository_#{repository_id}"
          # puts "Pusher: notifying channel #{channel} about #{event}: #{data.inspect}"
          ::Pusher[channel].trigger(event, data.to_json)
        end
    end
  end
end
