module TestHelper
  module Redis
    def flush_redis
      Resque.redis.flushall
    rescue
      skip("Cannot connect to Redis. Omitting this test.")
    end
  end
end
