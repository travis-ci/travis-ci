module TestHelpers
  module Redis
    def flush_redis
      Resque.redis.flushall
    end
  end
end
