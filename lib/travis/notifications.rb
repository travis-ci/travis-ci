module Travis
  module Notifications
    autoload :Email,   'travis/notifications/email'
    autoload :Irc,     'travis/notifications/irc'
    autoload :Pusher,  'travis/notifications/pusher'
    autoload :Webhook, 'travis/notifications/webhook'
    autoload :Worker,  'travis/notifications/worker'

    class << self
      include Logging

      def subscriptions
        @subscriptions ||= Array(Travis.config.notifications).inject({}) do |subscriptions, subscriber|
          subscriber = const_get(subscriber.to_s.camelize)
          subscriptions.merge(subscriber.new => subscriber::EVENTS)
        end
      end

      def dispatch(event, *args)
        subscriptions.each do |subscriber, subscription|
          if matches?(subscription, event)
            log "notifying #{subscriber.class.name} about #{event.inspect} (#{args.map { |arg| arg.inspect }.join(', ')})"
            subscriber.notify(event, *args)
          end
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
        namespace = object.class.name.underscore.gsub('/', ':').gsub('travis:model:', '')
        [namespace, event].join(':')
      end
  end
end
