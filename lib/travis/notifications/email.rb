require 'net/smtp'

module Travis
  module Notifications
    class Email
      EVENTS = 'build:finished'

      def notify(event, object, *args)
        send_emails(object) if object.send_email_notifications?
      end

      protected

        def send_emails(object)
          email(object).deliver
        rescue Errno::ECONNREFUSED, Net::SMTPError => e
          puts e.message, e.backtrace
        end

        def email(object)
          mailer(object).send(:"#{object.state}_email", object, object.email_recipients)
        end

        def mailer(object)
          Travis::Mailer.const_get(object.class.name.gsub('Travis::Model::', ''))
        end
    end
  end
end
