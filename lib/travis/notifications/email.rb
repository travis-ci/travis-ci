module Travis
  module Notifications
    module Email
      class BuildMailer < ActionMailer::Base
        default :from => 'notifications@travis-ci.org'

        helper BuildMailerHelper

        def finished_email(build)
          @build     = build
          subject    = "#{build.repository.slug}##{build.number} (#{build.branch} - #{build.commit[0, 7]}): the build has #{build.passed? ? 'passed' : 'failed' }"
          recipients = build.unique_recipients
          mail(:to => recipients, :subject => subject)
        end
      end

      def self.notify(build)
        BuildMailer.finished_email(build).deliver
      rescue Net::SMTPError => e
        # TODO might want to log this event. e.g. happens when people specify bad email addresses like "foo[at]bar[dot]com"
      end
    end
  end
end