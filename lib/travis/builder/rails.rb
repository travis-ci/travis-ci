require 'em-http-request'
require 'uri'

module Travis
  class Builder
    module Rails
      def work!
        @done = []
        @msg_id = 0
        super
      end

      def on_start
        super
        post('started_at' => started_at, 'msg_id' => msg_id)
      end

      def on_configure
        super
        post('config' => result, 'msg_id' => msg_id)
      end

      def on_log(chars)
        super
        post('log' => chars, 'append' => true, 'msg_id' => msg_id)
      end

      def on_finish
        super
        post('status' => result, 'finished_at' => Time.now, 'msg_id' => msg_id)
     end

      protected
        def msg_id
          @msg_id += 1
        end

        def post(data)
          host = rails_config['url'] || 'http://127.0.0.1'
          url  = "#{host}/builds/#{build['id']}#{'/log' if data.delete('append')}"
          uri  = URI.parse(host)
          data = { :body => { '_method' => 'put', 'build' => data }, :head => { :authorization => [uri.user, uri.password] } }
          # stdout.puts "-- post to #{url} : #{data.inspect}"
          register_connection EventMachine::HttpRequest.new(url).post(data)
        rescue Exception => e
          stdout.puts e.inspect
        end

        def rails_config
          @rails_config ||= Travis.config['rails']
        end
    end
  end
end
