require 'rubygems'
require 'redis'

redis = Redis.connect

trap(:INT) { puts; exit }

redis.psubscribe('*') do |on|
  on.pmessage do |pattern, channel, message|
    puts "#{channel} #{message}"
  end
end
