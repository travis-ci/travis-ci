module Travis
  module Notifications
    module Email
      def self.notify(build)
        BuildMailer.finished_email(build).deliver
      rescue Net::SMTPError => e
        # TODO might want to log this event. e.g. happens when people specify bad email addresses like "foo[at]bar[dot]com"
      end
    end
  end
end