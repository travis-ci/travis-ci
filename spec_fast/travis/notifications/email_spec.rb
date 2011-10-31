require 'spec_helper'

describe Travis::Notifications::Email do
  let(:build) { Travis::Models::Build.new(record) }

  before do
    Travis.config.notifications = [:email]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.instance_variable_set(:@subscriptions, nil)
  end

  it 'should be specified'
end

