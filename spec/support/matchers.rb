require 'uri'

RSpec::Matchers.define :post_webhooks_on do |event, options|
  match do |build|
    options[:to].each { |url| expect_request(url, build) }
    Travis::Notifications::Webhook.new.notify('build:finished', build)
  end

  def expect_request(url, build)
    uri = URI.parse(url)
    $http_stub.post uri.path do |env|
      env[:url].host.should == uri.host
      env[:url].path.should == uri.path
      env[:request_headers]['Authorization'].should == authorization_for(build)
      payload_from(env).keys.sort.should == build.as_json(:for => :webhook).keys.map(&:to_s).sort
    end
  end

  def payload_from(env)
    JSON.parse(Rack::Utils.parse_query(env[:body])['payload'])
  end

  def authorization_for(build)
    Travis::Notifications::Webhook.new.send(:authorization, build)
  end
end

RSpec::Matchers.define :send_email_notification_on do |event|
  match do |build|
    lambda do
      Travis::Notifications::Email.new.notify(event, build)
    end.should change(ActionMailer::Base.deliveries, :size).by(1)
    ActionMailer::Base.deliveries.last
  end
end

RSpec::Matchers.define :have_body_text do |text|
  match do |email|
    text = text.strip.split("\n").map(&:strip).join("\n")
    body = email.body.to_s

    description { "have the expected body text" }
    failure_message_for_should { "body does not contain the expected text\n\n--- actual:\n\n#{body}\n\n---- expected:\n\n#{text}" }
    failure_message_for_should_not { "body should not contain the given text\n\n--- actual:\n\n#{body}\n\n---- not expected:\n\n#{text}" }

    body.include?(text)
  end
end

RSpec::Matchers.define :have_subject do |subject|
  match do |email|
    description { "have subject of #{subject.inspect}" }
    failure_message_for_should { "expected the subject to be #{subject.inspect} but was #{email.subject.inspect}" }
    failure_message_for_should_not { "expected the subject not to be #{subject.inspect} but was" }

    email.subject == subject
  end
end

RSpec::Matchers.define :deliver_to do |expected|
  match do |email|
    actual = (email.header[:to].addrs || []).map(&:to_s)

    description { "be delivered to #{expected.inspect}" }
    failure_message_for_should { "expected #{email.inspect} to deliver to #{expected.inspect}, but it delivered to #{actual.inspect}" }
    failure_message_for_should_not { "expected #{email.inspect} not to deliver to #{expected.inspect}, but it did" }

    actual.sort == expected.sort
  end
end


