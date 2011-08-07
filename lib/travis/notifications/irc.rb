require 'irc_client'

module Travis
  module Notifications
    class Irc
      EVENTS = 'build:finished'

      def notify(event, build, *args)
        send_irc_notifications(build) if send_irc_notifications?(build)
      end

      protected

        def send_irc_notifications?(build)
          build.config && build.config[:notifications] && !!build.config[:notifications][:irc]
        end

        def send_irc_notifications(build)
          config = build.config[:notifications][:irc]
          config = [config] if config.is_a?(String)
          config.each { |irc_url| connect_and_log(irc_url, build) }
        end

        def connect_and_log(irc_url, build)
          server, port, channel = parse(irc_url)
          commit = build.commit
          build_url = self.build_url(build)

          irc(server, name, channel, :port => port) do
            say "[travis-ci] #{build.repository.slug}##{build.number} (#{commit.branch} - #{commit.commit[0, 7]} : #{commit.author_name}): the build has #{build.passed? ? 'passed' : 'failed' }"
            say "[travis-ci] Change view : #{commit.compare_url}"
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
          server_and_port, channel = url.split('#')
          server, port = server_and_port.split(':')
          [server, port, channel]
        end

        def name
          Travis.config.irc.try(:name) || 'travis-ci'
        end

        def build_url(build)
          Rails.application.routes.url_helpers.user_repo_build_redirect_url(
            :user => build.repository.owner_name,
            :repository => build.repository.name,
            :id => build.id,
            :host => Travis.config.domain || 'test.travis-ci.org'
          )
        end
    end
  end
end
