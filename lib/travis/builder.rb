require 'eventmachine'
require 'resque/plugins/meta'

module Travis
  class Builder
    autoload :Base,   'travis/builder/base'
    autoload :Pusher, 'travis/builder/pusher'
    autoload :Rails,  'travis/builder/rails'
    autoload :Stdout, 'travis/builder/stdout'

    extend Resque::Plugins::Meta
    include Base

    class << self
      def init
        require 'resque/heartbeat'

        include Travis::Builder::Stdout
        include Travis::Builder::Rails
        # include Travis::Builder::Pusher

        Resque.redis = ENV['REDIS_URL'] || Travis.config['redis']['url']
      end

      def perform(meta_id, payload)
        EM.run do
          sleep(0.01) until EM.reactor_running?
          EM.defer do
            begin
              builder = new(meta_id, payload)
              builder.work!
              sleep(0.1) until builder.messages.empty? && builder.connections.empty?
              EM.stop
            rescue Exception => e
              $_stdout.puts(e.message)
              e.backgtrace.each { |line| $_stdout.puts(line) }
            end
          end
        end
      end
    end
  end
end
