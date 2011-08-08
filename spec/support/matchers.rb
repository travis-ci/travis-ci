require 'uri'

RSpec::Matchers.define :send_email_notification_on do |event|
  match do |build|
    dispatch =  lambda { Travis::Notifications.dispatch(event, build) }
    dispatch.should change(ActionMailer::Base.deliveries, :size).by(1)
    ActionMailer::Base.deliveries.last
  end
end

RSpec::Matchers.define :post_webhooks_on do |event, object, options|
  match do |dispatch|
    options[:to].each { |url| expect_request(url, object) }
    dispatch.call(event, object)
  end

  def expect_request(url, object)
    uri = URI.parse(url)
    $http_stub.post uri.path do |env|
      env[:url].host.should == uri.host
      env[:url].path.should == uri.path
      env[:request_headers]['Authorization'].should == authorization_for(object)
      payload_from(env).keys.sort.should == object.as_json(:for => :webhook).keys.map(&:to_s).sort
    end
  end

  def payload_from(env)
    JSON.parse(Rack::Utils.parse_query(env[:body])['payload'])
  end

  def authorization_for(object)
    Travis::Notifications::Webhook.new.send(:authorization, object)
  end
end

RSpec::Matchers.define :serve_status_image do |status|
  match do |request|
    path = "#{Rails.public_path}/images/status/#{status}.png"
    controller.expects(:send_file).with(path, { :type => 'image/png', :disposition => 'inline' }).once
    request.call
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


