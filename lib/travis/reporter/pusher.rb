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
          pusher(channel).trigger(event, data)
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
          @pusher_config ||= YAML.load_file(File.expand_path('../../../../config/pusher.yml', __FILE__))
        end
    end
  end
end
