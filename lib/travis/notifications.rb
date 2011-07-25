module Travis
  module Notifications
    def self.register_notifier(notifier)
      @notifiers ||= []
      @notifiers << notifier
    end

    def self.send_notifications(build)
      @notifiers.each { |notifier| notifier.notify(build) }
    end
  end
end

require 'travis/notifications/email'
require 'travis/notifications/irc'
require 'travis/notifications/webhook'
