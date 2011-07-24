require 'travis/notifications/email'

module Travis
  module Notifications
    def self.send_notifications(build)
      Email.notify(build)
    end
  end
end