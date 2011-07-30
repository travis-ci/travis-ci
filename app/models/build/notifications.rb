class Build
  module Notifications
    def send_notifications?
      parent ? parent.matrix_finished? : finished?
    end

    def send_email_notifications?
      notifications_enabled? && unique_recipients.present?
    end

    # at some point we might want to move this to a Notifications manager that abstracts email and other types of notifications
    def unique_recipients
      @unique_recipients ||= begin
        if recipients_from_config
          recipients_from_config
        else
          recipients = [committer_email, author_email, repository.owner_email]
          recipients.select(&:present?).join(',').split(',').map(&:strip).uniq.join(',')
        end
      end
    end

    protected

      def notifications_enabled?
        if self.config && notifications = self.config['notifications']
          if !notifications['email'].nil?
            notifications['email']
          elsif notifications['disabled']
            !notifications['disabled']
          elsif notifications['disable']
            !notifications['disable']
          else
            true
          end
        else
          true
        end
      end

      def recipients_from_config
        @recipients_from_config = if config && notifications = config['notifications']
          emails = notifications['email'] || notifications['recipients']
          emails ? emails : nil
        end
      end
  end
end
