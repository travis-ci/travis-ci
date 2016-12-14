require 'rubygems'
require 'redis'

$: << File.expand_path('../../lib', __FILE__)
require 'travis/stdout_dup'

STDOUT.sync = true

EM.run do
  redis = Redis.new(:host => '127.0.0.1', :port => 6379)

  stream = StdoutDup.new do |data|
    redis.publish(:foo, data)
  end

  EM.defer do
    10.times do
      print '.'
      sleep(0.1)
    end
    system 'echo "+++"'
    stream.close
    EM.stop
  end
end
