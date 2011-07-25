require 'test_helper'
require 'travis/notifications'

class WebhookTest < ActiveSupport::TestCase
  def setup
    # Setup Faraday
    stub_adapter
    # Setup the test object
    @repository = Factory(:repository)
  end

  def test_finished_webhook
    config = { 'notifications' => { 'webhooks' => ['http://evome.fr/notifications', 'http://example.com/'] } }
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    stub_request '/notifications', build do |env|
      assert_equal 'evome.fr', env[:url].host
    end
    stub_request '/', build do |env|
      assert_equal 'example.com', env[:url].host
    end

    Travis::Notifications::Webhook.notify(build)
  end

  def test_finished_webhook_as_a_string
    config = { 'notifications' => { 'webhooks' => 'http://evome.fr/notifications' } }
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    stub_request '/notifications', build do |env|
      assert_equal 'evome.fr', env[:url].host
    end

    Travis::Notifications::Webhook.notify(build)
  end

   def test_no_webhook
    config = { 'notifications' => { 'webhooks' => '' } }
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    Travis::Notifications::Webhook.notify(build)

    # No need to assert anything here as Faraday would complain about a request not being stubbed <3
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
      assert_equal build.as_json.keys, JSON.parse(Rack::Utils.parse_query(env[:body])['payload']).keys
      yield(env) if block_given?
    end
  end
end
