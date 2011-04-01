require 'em-http-request'
require 'uri'

module Travis
  class Builder
    module Rails
      attr_reader :messages

      def work!
        @messages = []
        @msg_id = 0
        send_messages!
        super
      end

      def on_start
        super
        post('started_at' => started_at)
      end

      def on_configure
        super
        post('config' => result)
      end

      def on_log(chars)
        super
        post('log' => chars, 'append' => true)
      end

      def on_finish
        super
        post('finished_at' => Time.now, 'status' => result, 'log' => log)
     end

      protected
        def msg_id
          @msg_id += 1
        end

        def post(data)
          path = "/builds/#{build['id']}"
          path += '/log' if data.delete('append')
          data = { '_method' => 'put', 'build' => data, 'msg_id' => msg_id }
          messages << [path, data]
        rescue Exception => e
          # stdout.puts e.inspect
        end

        def send_messages!
          EM.add_timer(0.1) do
            if message = messages.shift
              path, body = *message
              # stdout.puts "-- message to #{path} : #{body.inspect}"
              request = http(path).post(:body => message[1], :head => { 'authorization' => auth })
              request.callback { send_messages! }
            end
          end
        end

        def http(path)
          EventMachine::HttpRequest.new([host, path].join('/'))
        end

        def host
          @host ||= rails_config['url'] || 'http://127.0.0.1'
        end

        def uri
          @uri ||= URI.parse(host)
        end

        def auth
          @auth ||= [uri.user, uri.password]
        end

        def rails_config
          @rails_config ||= Travis.config['rails'] || {}
        end
    end
  end
end
