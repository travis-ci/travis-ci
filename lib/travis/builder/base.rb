module Travis
  class Builder
    module Base
      attr_reader :repository, :build, :meta_id, :started_at, :finished_at, :log, :result

      def initialize(meta_id, payload)
        @meta_id    = meta_id
        @repository = payload['repository'].dup
        @build      = payload['build'].dup
        @log        = ''
      end

      def work!
        on_start
        @result = buildable.run!
        result.is_a?(Hash) ? on_configure : on_finish # TODO hrmmm ...
      end

      def buildable
        @buildable ||= Travis::Buildable.new(
          :script => 'rake',
          :commit => build['commit'],
          :config => build['config'],
          :url    => repository['url'] || "https://github.com/#{repository['slug']}"
        )
      end

      def repository_id
        build['repository']['id']
      end

      def on_start
        @started_at = Time.now
      end

      def on_configure
      end

      def on_log(chars)
        log << chars
      end

      def on_finish
        @finished_at = Time.now
      end

      def connections
        @connections ||= []
      end

      def register_connection(connection)
        connections << connection
        connection.callback { connections.delete(connection) }
        connection.errback  { connections.delete(connection) }
      end
    end
  end
end
