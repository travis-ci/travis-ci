require 'spec_helper'

describe Travis::Notifications::Webhook do
  before do
    Travis.config.notifications = [:webhook]
    stub_http
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  let(:dispatch) { lambda { |event, object| Travis::Notifications.dispatch(event, object) } }

  it "sends webhook notifications to the urls given as an array" do
    targets = ['http://evome.fr/notifications', 'http://example.com/']
    build = Factory(:build, :config => { 'notifications' => { 'webhooks' => targets } })
    dispatch.should post_webhooks_on('build:finished', build, :to => targets)
  end

  it "sends webhook notifications to a url given as a string" do
    target = 'http://evome.fr/notifications'
    build = Factory(:build, :config => { 'notifications' => { 'webhooks' => target } })
    dispatch.should post_webhooks_on('build:finished', build, :to => ['http://evome.fr/notifications'])
  end

  it "sends no webhook if the given url is blank" do
    build = Factory(:build, :config => { 'notifications' => { 'webhooks' => '' } })
    # No need to assert anything here as Faraday would complain about a request not being stubbed <3
    dispatch.call('build:finished', build)
  end

  def stub_http
    $http_stub ||= Faraday::Adapter::Test::Stubs.new
    Travis::Notifications::Webhook.http_client = Faraday.new do |f|
      f.request :url_encoded
      f.adapter :test, $http_stub
    end
  end
end

