module Travis
  module Notifications
    class << self
      # def register_notifier(notifier)
      #   @notifiers ||= []
      #   @notifiers << notifier
      # end

      # def send_notifications(build)
      #   return unless build.send_notifications?
      #   build = build.parent || build
      #   @notifiers.each { |notifier| notifier.notify(build)  }
      # end

      autoload :Email,   'travis/notifications/email'
      autoload :Irc,     'travis/notifications/irc'
      autoload :Webhook, 'travis/notifications/webhook'

      mattr_accessor :subscriptions

      def init(*subscribers)
        self.subscriptions = Array(subscribers).inject({}) do |subscriptions, subscriber|
          subscriber = subscriber.camelize.constantize.new if subscriber.is_a?(String)
          subscriptions.merge(subscriber::EVENTS => subscriber)
        end
      end

      def dispatch(event, *args)
        subscriptions.each do |subscription, subscriber|
          subscriber.receive(event, *args) if match?(subscription, event)
        end
      end

      protected

        def match?(subscription, event)
          Array(subscription).any? do |subscription|
            subscription.is_a?(Regexp) ? subscription.match?(event) : subscription == event
          end
        end
    end
  end
end

