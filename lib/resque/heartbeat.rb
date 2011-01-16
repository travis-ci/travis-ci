require 'resque'

module Resque
  def self.prune_dead_workers
    Worker.all.each do |worker|
      worker.unregister_worker if worker.last_heartbeat_before?(3)
    end
  end

  class Worker
    def startup_with_heartbeat
      startup_without_heartbeat
      Thread.new do
        loop do
          sleep(3)
          heartbeat!
        end
      end
    end
    alias startup_without_heartbeat startup
    alias startup startup_with_heartbeat

    # apparently the Redis connection is not thread-safe, so we connect another instance
    # see https://github.com/ezmobius/redis-rb/issues#issue/75
    def heartbeat_redis
      @heartbeat_redis ||= Redis.new("#{redis.port}:#{redis.port}")
    end

    def heartbeat!
      heartbeat_redis.sadd(:workers, self)
      heartbeat_redis.set("worker:#{self}:heartbeat", Time.now.to_s)
    end

    def last_heartbeat_before?(seconds)
      Time.parse(last_heartbeat).utc < (Time.now.utc - seconds)
    end

    def last_heartbeat
      redis.get("worker:#{self}:heartbeat") || started
    end
  end
end
