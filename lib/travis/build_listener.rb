require 'evented_redis'

module Travis
  class BuildListener
    class << self
      def add(*args)
        @instance ||= new
        @instance.add(*args)
      end
    end

    MESSAGE_MAP = { '.' => :log, '!' => :result }

    attr_reader :jobs

    def initialize
      @jobs = {}
      @subscriptions = {}
    end

    def add(job_id, build)
      channel = "build:#{job_id}"
      jobs[channel] = build
      subscribe_to_redis(channel)
      notify(:build_started, build)
    end

    protected

      def redis
        @redis ||= EventedRedis.connect
      end

      def subscribe_to_redis(channel)
        redis.subscribe(channel) do |command, channel, data|
          on_message(channel, data) if command == 'message'
        end
      end

      def unsubscribe_from_redis(channel)
        redis.unsubscribe(channel)
      end

      def on_message(channel, message)
        event = MESSAGE_MAP[message[0, 1]]
        send("on_#{event}", channel, message[1..-1]) if event
      end

      def on_log(channel, message)
        if build = jobs[channel]
          build.append_log(message)
          notify(:build_updated, build, :message => message)
        end
      end

      def on_result(channel, result)
        if build = jobs.delete(channel)
          build.update_attributes(:status => result.to_i) # TODO copy build meta data from redis
          notify(:build_finished, build, :status => result, :message => "build finished, status: #{result}")
          unsubscribe_from_redis(channel)
        end
      end

      def notify(event, build, data = {})
        p [event, data]
        channel = "repository_#{build.repository_id}"
        payload = build_json.merge(data.merge(:event => event))
        WebSocketServer.publish(channel, payload)
      end
  end
end
