module Travis
  module Notifications
    autoload :Email,   'travis/notifications/email'
    autoload :Irc,     'travis/notifications/irc'
    autoload :Webhook, 'travis/notifications/webhook'
    autoload :Worker,  'travis/notifications/worker'

    mattr_accessor :subscriptions

    class << self
      def init(*subscribers)
        self.subscriptions = Array(subscribers).inject({}) do |subscriptions, subscriber|
          subscriber = subscriber.camelize.constantize.new if subscriber.is_a?(String)
          subscriptions.merge(subscriber::EVENTS => subscriber)
        end
      end

      def dispatch(event, *args)
        subscriptions.each do |subscription, subscriber|
          subscriber.notify(event, *args) if match?(subscription, event)
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
