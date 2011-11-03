require 'bundler/setup'
require 'travis'

$stdout.sync = true

module Travis
  module Tasks
    class Thor < ::Thor
      namespace 'travis'

      desc 'consume', 'Consume AMQP messages from the worker'
      method_option :env, :aliases => '-e', :default => 'development'
      def consume
        Travis::Consumer.start(:env => options['env'])
      end
    end
  end
end

