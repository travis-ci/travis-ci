require "socket"

module Travis
  module Notifications
    class Irc
      EVENTS = 'build:finished'

      def receive(event, build, *args)
        send_irc_notifications(build) if send_irc_notifications?(build)
      end

      protected

        def send_irc_notifications?(build)
          build.config && build.config[:notifications] && !!build.config[:notifications][:irc]
        end

        def send_irc_notifications(build)
          if notify?(build)
            config = build.config[:notifications][:irc]
            config = [config] if config.is_a?(String)
            config.each { |irc_url| connect_and_log(irc_url, build) }
          end
        end

        def connect_and_log(irc_url, build)
          server, port, channel = parse(irc_url)
          build_url = build_details_url(build)

          irc(server, BOT_NAME, channel, :port => port) do
            say "[travis-ci] #{build.repository.slug}##{build.number} (#{build.branch} - #{build.commit[0, 7]} : #{build.author_name}): the build has #{build.passed? ? 'passed' : 'failed' }"
            say "[travis-ci] Change view : #{build.compare_url}"
            say "[travis-ci] Build details : #{build_url}"
          end
        end

        def irc(server, name, channel, options, &block)
          IrcClient.new(server, name, options).tap do |irc|
            irc.join(channel, &block)
            irc.quit
          end
        end

        def parse(url)
          server_and_port, channel = connection_string.split('#')
          server, port = server_and_port.split(':')
          [server, port, channel]
        end

        def bot_name
          Travis.config['irc'].try(:fetch, 'bot_name', 'travis-ci')
        end

        def build_details_url(build)
          Rails.application.routes.url_helpers.user_repo_build_redirect_url(
            :user => build.repository.owner_name,
            :repository => build.repository.name,
            :id => build.id,
            :host => Travis.config['domain'] || 'test.travis-ci.org'
          )
        end
    end
  end
end
