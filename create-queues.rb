#!/usr/bin/env ruby

require 'bundler/setup'
require 'bunny'

amqp = ARGV[0]

# amqp://gzqeyzpl:nTrc8hRERCiupG9e@qqkkcunk.rabbitmq-bigwig.lshift.net:17335/qqkkc unk

puts amqp

bunny = Bunny.new(amqp)
bunny.start

exchange = bunny.exchange('reporting', type: :topic, durable: true)

%w{builds.common builds.jvmotp builds.php builds.rails builds.requests builds.spree reporting.jobs.builds.common reporting.jobs.builds.jvmotp reporting.jobs.builds.php reporting.jobs.builds.rails reporting.jobs.builds.spree reporting.jobs.logs reporting.jobs.logs.0 reporting.jobs.logs.1 reporting.jobs.logs.2 reporting.jobs.logs.3 reporting.jobs.logs.4 reporting.jobs.logs.5 reporting.jobs.logs.6 reporting.jobs.logs.7 reporting.jobs.logs.8 reporting.jobs.logs.9 reporting.workers sync.user}.each do |queue_name|
  bunny.queue(queue_name, durable: true) 
end
