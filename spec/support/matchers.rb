require 'uri'

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


