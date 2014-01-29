require 'uri'

RSpec::Rails::Matchers::RoutingMatchers.send(:remove_method, :route_to)

RSpec::Matchers.define :route_to do |expected|
  match do |route|
    method, path = route.to_a.flatten
    actual = Rails.application.routes.recognize_path(path, :method => method)
    [expected, actual].each { |hash| hash.each { |key, value| hash[key] = hash[key].to_s } }

    failure_message_for_should     { "expected #{route} to be routed to\n#{expected} but was\n#{actual}" }
    failure_message_for_should_not { "expected #{route} not to be routed to #{expected} but it was" }

    actual == expected
  end
end

RSpec::Matchers.define :have_last_build do |build|
  match do |repository|
    repository.last_build_id.should == build.id
    repository.last_build_result.should == build.result
    repository.last_build_started_at.should == build.started_at
    repository.last_build_finished_at.should == build.finished_at
  end
end

RSpec::Matchers.define :send_email_notification_on do |event|
  match do |build|
    dispatch =  lambda { Travis::Event.dispatch(event, build) }
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

      payload = normalize_json(Travis::Handler::Notifications::Webhook::Payload.new(object).to_hash)
      payload_from(env).keys.sort.should == payload.keys.map(&:to_s).sort
    end
  end

  def payload_from(env)
    JSON.parse(Rack::Utils.parse_query(env[:body])['payload'])
  end

  def authorization_for(object)
    Travis::Event::Handler::Webhook.new.send(:authorization, object)
  end
end

RSpec::Matchers.define :serve_result_image do |result|
  match do |request|
    path = "#{Rails.root}/public/images/result/#{result}.png"
    controller.expects(:send_file).with(path, { :type => 'image/png', :disposition => 'inline' }).once
    request.call
  end
end

RSpec::Matchers.define :have_body_text do |text|
  match do |email|
    description { "have the expected body text" }

    body = email.parts.last.body.to_s
    lines = text.split("\n").map(&:strip).inject([]) do |lines, line|
      lines << "  #{line}" if line.present? && !body.include?(line)
      lines
    end

    failure_message_for_should { "The email body was expected to contain the following lines but didn't:\n\n#{lines.join("\n")}\n\nActual body: #{body}" }
    failure_message_for_should_not { "The email body was expected to not contain the following lines but did:\n\n#{lines.join("\n")}\n\nActual body: #{body}" }

    lines.empty?
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


RSpec::Matchers.define :have_message do |event|
  match do |pusher|
    @event = event

    description { "have a message #{event.inspect}" }
    failure_message_for_should { "expected pusher to receive #{event.inspect} but it did not. Instead it has the following messages: #{pusher.messages.map(&:first).map(&:inspect).join(', ')}" }
    failure_message_for_should_not { "expected pusher not to receive #{event.inspect} but it did" }

    !!find_message.tap { |message| pusher.messages.delete(message) }
  end

  def find_message
    pusher.messages.detect { |message| message.first == @event }
  end
end

RSpec::Matchers.define :be_queued do |*args|
  match do |job|
    @options = args.last.is_a?(Hash) ? args.pop : {}
    @queue = args.first || @options[:queue] || 'builds.common'
    @expected = job.is_a?(Job) ? Travis::Event::Handler::Worker.payload_for(job, :queue => @queue) : job
    @actual = queued_job ? queued_job['args'].last.deep_symbolize_keys : nil

    @actual == @expected
  end

  def queued_job
  end

  def jobs
  end

  failure_message_for_should do
    @actual ?
      "expected the job queued in #{@queue.inspect} to have the payload #{@actual.inspect} but had #{@expected.inspect}" :
      "expected a job with the payload #{@expected.inspect} to be queued in #{@queue.inspect} but none was found. Instead there are the following jobs:\n\n#{jobs}"
  end

  failure_message_for_should_not do
    @actual ?
      "expected the job queued in #{@queue.inspect} not to have #{@actual.inspect} but it has" :
      "expected no job with the payload #{@expected.inspect} to be queued in #{@queue.inspect} but it is"
  end
end

RSpec::Matchers.define :be_published do |*args|
  match do |job|
    queue = 'builds.common'
    expected = Travis::Event::Handler::Worker::Payload.for(job)

    failure_message_for_should do
      "expected a message with the payload #{expected.inspect} to be published in #{queue.inspect} but none was found. Instead there are the following jobs:\n\n#{messages.inspect}"
    end

    failure_message_for_should_not do
      "expected no message with the payload #{expected.inspect} to be published in #{queue.inspect} but it is."
    end

    messages.detect { |message| message.last == expected }.tap do |message|
      messages.delete(message)
    end
  end

  def messages
    Travis::Event::Handler::Worker.amqp.messages
  end
end

# class RouteToVersionMatcher
#   include RSpec::Matchers::BaseMatcher
#
#   def initialize(scope, version)
#     @scope = scope
#     @expected_version = version
#   end
#
#   def matches?(verb_to_path_map)
#     @verb_to_path_map = verb_to_path_map
#     path, query = *verb_to_path_map.values.first.split('?')
#     request = @scope.send(:recognized_request_for, path)
#     controller = request.path_parameters[:controller]
#     @actual_version = controller.split('/').first
#     @expected_version == @actual_version
#   end
#
#   def failure_message
#     "#{@verb_to_path_map.inspect} was expected to be routed to #{@expected_version.inspect} but was routed to #{@actual_version}."
#   end
#
#   def negative_failure_message
#     "#{@verb_to_path_map.inspect} was expected not to be routed to #{@expected_version.inspect} but it was."
#   end
# end
#
# def route_to_version(version)
#   RouteToVersionMatcher.new(self, version)
# end

