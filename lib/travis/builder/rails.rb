require 'patron'
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
          EM.add_periodic_timer(0.1) do
            if message = messages.shift
              # stdout.puts "-- message to #{message[0]} : #{message[1].inspect}"
              http.post(*message)
            end
          end
        end

        def http
          @http ||= Patron::Session.new.tap do |http|
            host = rails_config['url'] || 'http://127.0.0.1'
            uri  = URI.parse(host)
            http.base_url = host
            http.username = uri.user
            http.password = uri.password
          end
        end

        def rails_config
          @rails_config ||= Travis.config['rails']
        end
    end
  end
end
