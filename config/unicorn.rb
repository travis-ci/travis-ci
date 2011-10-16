# http://michaelvanrooijen.com/articles/2011/06/01-more-concurrency-on-a-single-heroku-dyno-with-the-new-celadon-cedar-stack/

ENV["RUNNING_ON_UNICORN"] = "true"

worker_processes 3 # amount of unicorn workers to spin up
timeout 15         # restarts workers that hang for 15 seconds

# after_fork do |server, worker|
#   require "amqp/utilities/event_loop_helper"
#   AMQP::Utilities::EventLoopHelper.run
#
#   require "travis"
#   AMQP.start(Travis.config.amqp) do |connection|
#     puts "Connected to AMQP broker"
#     AMQP.channel    = AMQP::Channel.new(connection)
#   end
# end
