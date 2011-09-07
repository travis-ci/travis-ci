class Build
  module Notifications
    def send_notifications_for?(receiver)
      # Filters can be configured for each notification receiver.
      # If receiver rules aren't configured, then fall back to the global rules, and then to the defaults.
      notify_on_success = config_with_global_fallback(receiver, :on_success, :change)
      notify_on_failure = config_with_global_fallback(receiver, :on_failure, :always)

      !previous_finished_on_branch ||
      (passed? && (notify_on_success == :always || (notify_on_success == :change && !previous_passed?))) ||
      (failed? && (notify_on_failure == :always || (notify_on_failure == :change && previous_passed?)))
    end

    def send_email_notifications?
      emails_enabled? && email_recipients.present? && send_notifications_for?(:email)
    end

    def send_webhook_notifications?
      webhooks.any? && send_notifications_for?(:webhooks)
    end

    def send_irc_notifications?
      irc_channels.any? && send_notifications_for?(:irc)
    end


    def email_recipients
      @email_recipients ||= if (recipients = notification_values(:email, :recipients)).any?
        recipients
      else
        notifications[:recipients] || default_email_recipients # TODO deprecate recipients
      end
    end

    def webhooks
      @webhooks ||= notification_values(:webhooks, :urls).map {|webhook| webhook.split(' ') }.flatten.map(&:strip).reject(&:blank?)
    end

    def irc_channels
      @irc_channels ||= notification_values(:irc, :channels).inject(Hash.new([])) do |servers, url|
        server_and_port, channel = url.split('#')
        server, port = server_and_port.split(':')
        servers[[server, port]] += [channel]
        servers
      end
    end

    protected

      # Set config from either: (email/webhook/etc) if it's a hash, global config, or default value
      def config_with_global_fallback(receiver, key, default)
        if (notifications[receiver] && notifications[receiver].is_a?(Hash) && notifications[receiver].has_key?(key))
          notifications[receiver][key].to_sym
        elsif notifications.has_key?(key)
          notifications[key].to_sym
        else
          default
        end
      end

      # Returns (recipients, urls, channels) for (email, webhooks, irc)
      # Supported data types are Hash, Array and String
      def notification_values(receiver, hash_key)
        config = notifications[receiver]
        # Notification receiver config can be a string, an array of values,
        # or a hash containing a key for these values.
        Array(config.is_a?(Hash) ? config[hash_key] : config)
      end

      def emails_enabled?
        return !!notifications[:email] if notifications.has_key?(:email)
        # TODO deprecate disabled and disable
        [:disabled, :disable].each {|key| return !notifications[key] if notifications.has_key?(key) }
        true
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

