RSpec::Matchers.define :contain_recipients do |expected|
  match do |actual|
    actual = Array(actual).join(',').split(',')
    expected = Array(expected).join(',').split(',')
    (actual & expected).size.should == expected.size
  end

  failure_message_for_should do |actual|
    "expected #{actual} to contain #{expected}"
  end

  failure_message_for_should_not do |actual|
    "expected #{actual} to not contain #{expected}"
  end
end
