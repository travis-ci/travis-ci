class Build
  module Notifications
    def send_email_notifications?
      return false unless emails_enabled? && email_recipients.present?
      # Only send email notifications for a successful build if it's the first build,
      # the status has changed (from pass => fail or vice versa), or if :verbose mode.
      (!previous_finished_on_branch || verbose?) || (passed? && !previous_passed?) || (failed? && previous_passed?)
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
        return notifications[:email] if notifications.has_key?(:email)
        # TODO deprecate disabled and disable
        [:disabled, :disable].each {|key| return !notifications[key] if notifications.has_key?(key) }
        true
      end

      end

      def verbose?
        notifications.blank? ? false : notifications[:verbose]
      end

      def previous_passed?
        previous_finished_on_branch && previous_finished_on_branch.passed?
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

