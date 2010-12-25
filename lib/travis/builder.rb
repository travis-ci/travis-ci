require 'eventmachine'
require 'resque/plugins/meta'

module Travis
  class Builder
    extend Resque::Plugins::Meta

    @queue = :builds

    class << self
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

    module Base
      attr_reader :build, :meta_id

      def initialize(meta_id, build)
        @meta_id = meta_id
        @build   = build.dup
      end

      def work!
        on_start
        result = buildable.build!
        sleep(1)
        on_finish
      end

      def buildable
        buildable = Travis::Buildable.new('bundle install; rake', :commit => build['commit'], :url => build['repository']['url'])
      end

      def repository_id
        build['repository']['id']
      end

      def on_start
        build.merge!('log' => '', 'started_at' => Time.now)
      end

      def on_log(chars)
        build['log'] << chars
      end

      def on_finish
        build.merge!('finished_at' => Time.now)
      end
    end

    include Base
  end
end
