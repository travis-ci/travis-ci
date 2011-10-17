# This initialize sets up AMQP connection for cases like specs
# or scripts. When we are running on Unicorn, it MUST happen
# after Unicorn forks off workers so we do it in the respective hook.
#
# See http://rubydoc.info/github/ruby-amqp/amqp/master/file/docs/ConnectingToTheBroker.textile#Using_Ruby_amqp_gem_with_Unicorn

require 'travis'

unless !!ENV["travis_config"] # only heroku has the config loaded in the env
  Travis::Amqp.setup_connection
end
