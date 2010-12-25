require 'em-http-request'

module Travis
  module Reporter
    module Rails
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
        post(:log => chars)
      end

      def on_finish
        super
        post(:log => build['log'], :finished_at => build['finished_at'])
      end

      protected

        def post(data)
          url  = "http://127.0.0.1:3000/builds/#{build['id']}#{'/log' if data[:log]}"
          data = { :_method => :put, :build => data }
          # puts "post to {url} : #{data[:build].inspect}"
          http = EventMachine::HttpRequest.new(url).post(:body => data)
        end
    end
  end
end
