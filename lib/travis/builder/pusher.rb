require 'json'
require 'em-pusher'

module Travis
  class Builder
    module Pusher
      attr_accessor :msg_id

      def on_start
        super
        self.msg_id = 0
        push 'build:started', 'build' => build.merge('started_at' => started_at)
      end

      def on_log(log)
        super
        push 'build:log', 'build' => { 'id' => build['id'], 'repository' => { 'id' => build['repository']['id'] } }, 'log' => log, 'msg_id' => (self.msg_id += 1)
      end

      def on_finish
        super
        push 'build:finished', 'build' => build.merge('status' => result, 'finished_at' => finished_at)
      end

      protected
        def push(event, data)
          # TODO fix channels
          channel = 'repositories'
          # channel = :"repository_#{repository_id}"

          # stdout.puts "Pusher: notifying channel #{channel} about #{event}: #{data.inspect}"
          register_connection pusher(channel).trigger(event, data)
          # sleep(0.1) # TODO how to synchronize websocket messages
        end

        def pusher(channel)
          EventMachine::Pusher.new(
            :app_id      => ENV['pusher_app_id'] || pusher_config['app_id'],
            :auth_key    => ENV['pusher_key']    || pusher_config['key'],
            :auth_secret => ENV['pusher_secret'] || pusher_config['secret'],
            :channel     => channel
          )
        end

        def pusher_config
          @pusher_config ||= Travis.config['pusher']
        end
    end
  end
end
