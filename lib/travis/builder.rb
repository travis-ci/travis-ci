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

    @queue = :builds

    class << self
      def init
        include Travis::Builder::Stdout
        include Travis::Builder::Rails
        include Travis::Builder::Pusher

        Resque.redis = ENV['REDIS_URL'] || Travis.config['redis']['url']
      end

      def perform(meta_id, payload)
        EM.run do
          sleep(0.01) until EM.reactor_running?
          EM.defer do
            new(meta_id, payload).work!
            sleep(1)
            EM.stop
          end
        end
      end
    end
  end
end
