module Travis
  module Notifications
    autoload :Email,   'travis/notifications/email'
    autoload :Irc,     'travis/notifications/irc'
    autoload :Webhook, 'travis/notifications/webhook'
    autoload :Worker,  'travis/notifications/worker'

    mattr_accessor :subscriptions
    self.subscriptions = []

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

    def notify(*args)
      event = args.shift # TODO maybe a simple_states bug? can't add event to the signature.
      Travis::Notifications.dispatch(client_event(event, self), self, *args)
    end

    protected

      def client_event(event, object)
        event = "#{event}ed".gsub('eed', 'ed') unless event == :log
        # ['build', event].join(':') # later: object.class.name.demodulize.underscore
        [object.class.name.underscore.gsub('/', ':'), event].join(':')
      end
  end
end
