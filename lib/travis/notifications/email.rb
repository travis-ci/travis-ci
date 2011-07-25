module Travis
  module Notifications
    module Email
      def self.notify(build)
        BuildMailer.finished_email(build).deliver if build.send_email_notifications?
      rescue Net::SMTPError => e
        # TODO might want to log this event. e.g. happens when people specify bad email addresses like "foo[at]bar[dot]com"
      end
    end

    register_notifier(Email)
  end
end