# This initialize sets up AMQP connection for cases like specs
# or scripts. When we are running on Unicorn, it MUST happen
# after Unicorn forks off workers so we do it in the respective hook.
#
# See http://rubydoc.info/github/ruby-amqp/amqp/master/file/docs/ConnectingToTheBroker.textile#Using_Ruby_amqp_gem_with_Unicorn

unless ENV["RUNNING_ON_UNICORN"]
  puts "Not running on Unicorn, connecting to AMQP broker"

  require "amqp/utilities/event_loop_helper"
  AMQP::Utilities::EventLoopHelper.run

  require 'travis'
  AMQP.start(Travis.config.amqp) do |connection|
    puts "Connected to AMQP broker"
    AMQP.channel    = AMQP::Channel.new(connection)
  end
end


