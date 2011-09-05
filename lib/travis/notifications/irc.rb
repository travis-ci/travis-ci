require 'irc_client'

module Travis
  module Notifications
    class Irc
      EVENTS = 'build:finished'

      def notify(event, build, *args)
        send_irc_notifications(build) if build.send_irc_notifications?
      end

      protected
        def send_irc_notifications(build)
          build.irc_channels.each {|channel_data| send_notification(channel_data, build) }
        end

        def send_notification(channel_data, build)
          server, port, channel = *channel_data
          commit = build.commit
          build_url = self.build_url(build)

          irc(server, nick, channel, :port => port) do |irc|
            say "[travis-ci] #{build.repository.slug}##{build.number} (#{commit.branch} - #{commit.commit[0, 7]} : #{commit.author_name}): the build has #{build.passed? ? 'passed' : 'failed' }"
            say "[travis-ci] Change view : #{commit.compare_url}"
            say "[travis-ci] Build details : #{build_url}"
          end
        end

        def irc(server, nick, channel, options, &block)
          IrcClient.new(server, nick, options).tap do |irc|
            irc.join(channel)
            irc.run(&block) if block_given?
            irc.leave
            irc.quit
          end
        end

        def nick
          Travis.config.irc.try(:nick) || 'travis-ci'
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

