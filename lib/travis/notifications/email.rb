module Travis
  module Notifications
    class Email
      EVENTS = 'build:finished'

      def receive(event, object, *args)
        send_emails(object) if object.send_email_notifications?
      end

      protected

        def send_emails(object)
          email(object).deliver
        rescue Net::SMTPError => e
          # TODO need to log this event. e.g. happens when people specify bad email addresses like "foo[at]bar[dot]com"
        end

        def email(object)
          mailer(object).send(:"#{object.state}_email", object)
        end

        def mailer(object)
          "#{object.class.name}Mailer".constantize.new
        end
    end
  end
end
