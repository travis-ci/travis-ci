ENV["RAILS_ENV"] ||= 'test'

RSpec.configure do |c|
  c.mock_with :mocha
  c.before(:each) { Time.now.tap { | now| Time.stubs(:now).returns(now) } }
end

require 'support/payloads'
require 'support/matchers'

require 'travis'
require 'travis/logging'
require 'stringio'
require 'mocha'

Travis.logger = Logger.new(StringIO.new)

include Mocha::API

RSpec.configure do |c|
  c.after :each do
    Travis.config.notifications.clear
    Travis::Notifications.instance_variable_set(:@subscriptions, nil)
    Travis::Notifications::Pusher.send(:protected, :queue_for, :payload_for)
  end
end
