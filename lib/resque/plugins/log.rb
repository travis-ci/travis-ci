require 'eventmachine'
require 'travis/stream_stdout'
require 'resque/plugins/meta'

# move to Builder?

module Resque
  module Plugins
    module Log
      def self.extended(mod)
        mod.extend(Resque::Plugins::Meta)
      end

      def around_perform_log(meta_id, *args)
        channel = "build:#{meta_id}"

        EM.run do
          stream = Travis::StreamStdout.new do |data|
            redis.publish(channel, '.' + data)
          end

          EM.defer do
            begin
              result = yield
              redis.publish(channel, '!' + result.to_s)
            rescue Exception => e
              stream.close
              puts e.message
              e.backtrace.each { |line| puts line }
            ensure
              stream.close unless stream.closed?
              EM.stop
            end
          end
        end
      end

      def redis
        @redis ||= Redis.connect
      end
    end
  end
end
