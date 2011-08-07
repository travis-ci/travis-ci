module TestHelpers
  module RedisHelper
    def flush_redis
      Resque.redis.flushall
    end
  end
end
