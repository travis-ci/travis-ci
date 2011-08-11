class Build
  module Notifications
    def send_notifications?
      # ensure that notifications for a successful build only get sent in verbose mode
      if parent
        parent.matrix_finished? && ((parent.passed? && verbose?) || !passed?)
      else
        finished? && ((passed? && verbose?) || !passed?)
      end
    end

    def send_email_notifications?
      emails_enabled? && unique_recipients.present?
    end
    
    def verbose?
      notifications['verbose']
    end

    # at some point we might want to move this to a Notifications manager that abstracts email and other types of notifications
    def unique_recipients
      @unique_recipients ||= begin
        if email_recipients
          email_recipients
        else
          recipients = [committer_email, author_email, repository.owner_email]
          recipients.select(&:present?).join(',').split(',').map(&:strip).uniq.join(',')
        end
      end
    end

    protected

      def emails_enabled?
        if notifications.blank?
          true
        elsif emails_disabled?
          false
        else
          true
        end
      end

      def email_recipients
        notifications['email'] || notifications['recipients'] # TODO deprecate recipients
      end

      def emails_disabled?
        notifications['email'] == false || notifications['disabled'] || notifications['disable'] # TODO deprecate disabled and disable
      end

      def notifications
        config.try(:fetch, 'notifications', {}) || {}
      end
  end
end
