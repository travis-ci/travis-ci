require 'evented_redis'
require 'travis/build_listener'

EM.run do
  redis = EventedRedis.connect
  meta_id = '64db0a67f47e7a6f06e080a31bc593b69c37e3da'
  channel = "build:#{meta_id}"

  Travis::BuildListener.new(redis, meta_id) do |listener|
    listener.on_log do |channel, message|
      # append output to build record and send to websocket clients
      p "log: #{message[1..-1]} from #{channel}"
    end

    listener.on_result do |channel, message|
      # set result to build record, copy meta data from redis and send to websocket clients
      p "result: #{message[1..-1]} from #{channel}"
      listener.unsubscribe(channel)
    end
  end

  # fake publisher
  EM.defer do
    redis = EventedRedis.connect
    redis.publish(channel, '.foo')
    redis.publish(channel, '!0')

    sleep(0.01)
    redis.publish(channel, '.foo') # should not get through

    sleep(0.01)
    EM.stop
  end
end
