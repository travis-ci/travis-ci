When /^I embed the status button for "([^"]*)"$/ do |name|
  visit "/#{name}.png"
end

Then /^the status button should say "([^"]*)"$/ do |status|
  assert_equal "/images/status/#{status}.png", URI.parse(current_url).path
end
