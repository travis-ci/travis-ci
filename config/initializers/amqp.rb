require 'travis'
require 'travis/support'

Travis::Amqp.config = Travis.config.amqp


# This initialize sets up AMQP connection for cases like specs
# or scripts. When we are running on Unicorn, it MUST happen
# after Unicorn forks off workers so we do it in the respective hook.
#
# See http://rubydoc.info/github/ruby-amqp/amqp/master/file/docs/ConnectingToTheBroker.textile#Using_Ruby_amqp_gem_with_Unicorn

# require 'travis'

# only heroku has the config loaded in the env
# Travis::Amqp.setup_connection unless ENV.key?('travis_config')
#
# Travis::Amqp has changed to a lazy instantiation of the connection object, so I guess that's fine?
# I.e. Github won't be able to ping before Unicorn has forked, so the connection won't be created
# before the fork either?
