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
        post(:log => build['log'], :status => build['status'], :finished_at => build['finished_at'])
      end

      protected

        def post(data)
          host = rails_config['url'] || 'http://127.0.0.1'
          uri  = URI.parse(host)
          url  = "#{host}/builds/#{build['id']}#{'/log' if data.delete(:append)}"
          data = { :_method => :put, :build => data }
          # $_stdout.puts "-- post to #{url} : #{{:body => data, :head => { :authorization => [uri.user, uri.password] }}.inspect}"
          # $_stdout.puts '---'
          # $_stdout.puts data[:build][:log]
          http = EventMachine::HttpRequest.new(url).post(:body => data, :head => { :authorization => [uri.user, uri.password] })
        end

        def rails_config
          @rails_config ||= Travis.config['rails']
        end
    end
  end
end
