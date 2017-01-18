require 'unit/notifications/notifications_test_case'

class WebhookTest < NotificationsTestCase
  def setup
    super

    # Setup Faraday
    stub_adapter
  end

  def test_finished_webhook
    build = create_build({ 'notifications' => { 'webhooks' => ['http://evome.fr/notifications', 'http://example.com/']}})

    stub_request '/notifications', build do |env|
      assert_equal 'evome.fr', env[:url].host
    end
    stub_request '/', build do |env|
      assert_equal 'example.com', env[:url].host
    end

    Travis::Notifications::Webhook.notify(build)
  end

  def test_finished_webhook_as_a_string
    build = create_build({ 'notifications' => { 'webhooks' => 'http://evome.fr/notifications' }})

    stub_request '/notifications', build do |env|
      assert_equal 'evome.fr', env[:url].host
    end

    Travis::Notifications::Webhook.notify(build)
  end

   def test_no_webhook
    build = create_build({ 'notifications' => { 'webhooks' => '' }})

    Travis::Notifications::Webhook.notify(build)

    # No need to assert anything here as Faraday would complain about a request not being stubbed <3
  end

   def test_webhook_notification_sent_via_travis_notifications
    build = create_build({ 'notifications' => { 'webhooks' => "http://evome.fr/notifications" } })

    stub_request '/notifications', build do |env|
      assert_equal 'evome.fr', env[:url].host
    end

    Travis::Notifications.send_notifications(build)
  end

  def stub_adapter
    Travis::Notifications::Webhook.class_eval do
      def self.stubbed_adapter
        @stubbed_adapter ||= Faraday::Adapter::Test::Stubs.new
      end

      def http_adapter
        @http_adapter ||= Faraday.new do |b|
          b.request :url_encoded
          b.adapter :test, self.class.stubbed_adapter
        end
      end
    end
  end

  def stub_request(url, build)
    Travis::Notifications::Webhook.stubbed_adapter.post url do |env|
      assert_equal url, env[:url].path
      assert_equal build.as_json(:for => :webhook).keys.map(&:to_s).sort, JSON.parse(Rack::Utils.parse_query(env[:body])['payload']).keys.sort
      assert_equal env[:request_headers]['Authorization'],
        Digest::SHA2.hexdigest(build.repository.name + build.repository.owner_name + build.token)

      yield(env) if block_given?
    end
  end
end
