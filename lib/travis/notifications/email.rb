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
        rescue Net::SMTPError => e
        end

        def email(object)
          mailer(object).send(:"#{object.state}_email", object)
        end

        def mailer(object)
          "#{object.class.name}Mailer".constantize
        end
    end
  end
end
