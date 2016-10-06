When /^I embed the status button for "([^"]*)"$/ do |name|
  visit "/#{name}.png"
end

Then /^the status button should say "([^"]*)"$/ do |status|
  assert_equal File.read("#{Rails.root}/public/images/status/#{status}.png"), page.body
end
