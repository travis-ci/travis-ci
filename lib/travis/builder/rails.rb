require 'em-http-request'
require 'uri'

module Travis
  class Builder
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
        post(:log => chars, :append => true)
      end

      def on_finish
        super
        post(:config => build['config'], :log => build['log'], :status => build['status'], :finished_at => build['finished_at'])
      end

      protected
        def post(data)
          host = rails_config['url'] || 'http://127.0.0.1'
          url  = "#{host}/builds/#{build['id']}#{'/log' if data.delete(:append)}"
          uri  = URI.parse(host)
          data = { :body => { :_method => :put, :build => data }, :head => { :authorization => [uri.user, uri.password] } }
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
