require "socket"

module Travis
  module Notifications
    module Irc
      BOT_NAME = 'Travis-CI-bot'

      # based on :
      # https://github.com/sr/shout-bot
      #
      # libs to take note of :
      # https://github.com/tbuehlmann/ponder
      # https://github.com/cinchrb/cinch
      # https://github.com/cho45/net-irc
      class SimpleIrc
        attr_accessor :channel

        def initialize(server, nick, options={})
          @socket = TCPSocket.open(server, options[:port] || 6667)
          @socket.puts "PASSWORD #{password}" if options[:password]
          @socket.puts "NICK #{nick}"
          @socket.puts "USER #{nick} #{nick} #{nick} :#{nick}"
        end

        def join(channel, password = nil, &block)
          @channel = "##{channel}"
          password = password && " #{password}" || ""
          @socket.puts "JOIN #{@channel}#{password}"

          instance_eval(&block) and leave if block_given?
        end

        def leave
          @socket.puts "PART #{@channel}"
        end

        def say(message)
          @socket.puts "PRIVMSG #{@channel} :#{message}" if @channel
        end

        def quit
          @socket.puts "QUIT"
          @socket.gets until @socket.eof?
        end
      end

      def self.notify?(build)
        build.config && build.config['notifications'] && !!build.config['notifications']['irc']
      end

      def self.notify(build)
        if notify?(build)
          irc_details = build.config['notifications']['irc']
          irc_details = [irc_details] if irc_details.is_a?(String)
          irc_details.each { |connection_string| connect_and_log(connection_string, build) }
        end
      end

      def self.connect_and_log(connection_string, build)
        server_and_port, channel = connection_string.split('#')

        server, port = server_and_port.split(':')

        options = {}
        options[:port] = port.to_i if port

        build_url = build_details_url(build)

        sm = SimpleIrc.new(server, BOT_NAME, options)

        sm.join(channel) do
          say("[Travis-CI] #{build.repository.slug}##{build.number} (#{build.branch} - #{build.commit[0, 7]} : #{build.author_name}): the build has #{build.passed? ? 'passed' : 'failed' }")
          say("[Travis-CI] Change view : #{build.compare_url}")
          say("[Travis-CI] Build details : #{build_url}")
        end

        sm.quit
      end

      def self.build_details_url(build)
        Rails.application.routes.url_helpers.user_repo_build_redirect_url({
          :user => build.repository.owner_name,
          :repository => build.repository.name,
          :id => build.id,
          :host => Travis.config['domain'] || 'test.travis-ci.org'
        })
      end
    end

    register_notifier(Irc)
  end
end