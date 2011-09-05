class Build
  module Notifications
    def send_email_notifications?
      emails_enabled? && email_recipients.present?
    end

    def email_recipients
      @email_recipients ||= notifications[:email] || notifications[:recipients] || default_email_recipients # TODO deprecate recipients
    end

    def send_webhook_notifications?
      !!notifications[:webhooks]
    end

    def webhooks
      Array(notifications[:webhooks]).map { |webhook| webhook.split(' ') }.flatten.map(&:strip).reject(&:blank?)
    end

    protected

      def emails_enabled?
        notifications.blank? ? true : !emails_disabled?
      end

      def emails_disabled?
        notifications[:email] == false || notifications[:disabled] || notifications[:disable] # TODO deprecate disabled and disable
      end

      def default_email_recipients
        recipients = [commit.committer_email, commit.author_email, repository.owner_email]
        recipients.select(&:present?).join(',').split(',').map(&:strip).uniq.join(',')
      end

      def notifications
        config.fetch(:notifications, {})
      end
  end
end
