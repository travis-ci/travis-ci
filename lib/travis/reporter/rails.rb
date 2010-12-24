require 'em-http-request'

module Travis
  module Reporter
    module Rails
      attr_reader :done

      def work!
        @done = []
        super
      end

      def on_start
        super
        post(:started_at => build['started_at'])
      end

      def on_log(chars)
        super
        # TODO buffer chars and post to build/:id/log ?
      end

      def on_finish
        super
        post(:log => build['log'], :finished_at => build['finished_at'])
      end

      protected

        def post(data)
          # i've got no idea how to use this in a non-blocking manner
          EM.run do
            url  = "http://127.0.0.1:3000/builds/#{build['id']}"
            data = { :_method => :put, :build => data }
            # puts "post to {url} : #{data[:build].inspect}"

            http = EventMachine::HttpRequest.new(url).post(:body => data)
            http.errback  { |r| EM.stop }
            http.callback { |r| EM.stop }
          end
        end
    end
  end
end
