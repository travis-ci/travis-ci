module Travis
  module Notifications
    autoload :Email,   'travis/notifications/email'
    autoload :Irc,     'travis/notifications/irc'
    autoload :Pusher,  'travis/notifications/pusher'
    autoload :Webhook, 'travis/notifications/webhook'
    autoload :Worker,  'travis/notifications/worker'

    class << self
      def subscriptions
        @subscriptions ||= Array(Travis.config.notifications).inject({}) do |subscriptions, subscriber|
          subscriber = const_get(subscriber.to_s.camelize)
          subscriptions.merge(subscriber.new => subscriber::EVENTS)
        end
      end

      def dispatch(event, *args)
        subscriptions.each do |subscriber, subscription|
          subscriber.notify(event, *args) if matches?(subscription, event)
        end
      end

      protected

        def matches?(subscription, event)
          Array(subscription).any? do |subscription|
            subscription.is_a?(Regexp) ? subscription.match(event) : subscription == event
          end
        end
    end

    def notify(event, *args)
      Travis::Notifications.dispatch(client_event(event, self), self, *args)
    end

    protected

      def client_event(event, object)
        event = "#{event}ed".gsub('eed', 'ed') unless event == :log
        [object.class.name.underscore.gsub('/', ':'), event].join(':')
      end
  end
end
