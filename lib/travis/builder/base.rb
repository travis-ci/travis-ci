module Travis
  class Builder
    module Base
      attr_reader :build, :meta_id

      def initialize(meta_id, build)
        @meta_id = meta_id
        @build   = build.dup
      end

      def work!
        on_start
        config = buildable.configure
        on_run
        build['status'] = buildable(config).build!
        sleep(1)
        on_finish
      end

      def buildable(config = {})
        defaults = {
          :script => 'bundle install; rake',
          :commit => build['commit'],
          :url => build['repository']['url']
        }
        buildable = Travis::Buildable.new(defaults.merge(config))
      end

      def repository_id
        build['repository']['id']
      end

      def on_start
        build.merge!('log' => '', 'started_at' => Time.now)
      end

      def on_run
      end

      def on_log(chars)
        build['log'] << chars
      end

      def on_finish
        build.merge!('finished_at' => Time.now)
      end
    end
  end
end
