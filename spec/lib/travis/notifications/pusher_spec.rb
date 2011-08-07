require 'spec_helper'

describe Travis::Notifications::Pusher do
  before do
    Travis.config.notifications = [:pusher]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  # TODO actually subscribe Pusher to Notifications and go through Notifications.dispatch

  describe '' do
    it '' do
#      Pusher.
    end
  end
end

