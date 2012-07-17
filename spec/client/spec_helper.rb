require 'spec_helper'

RSpec.configure do |config|
  config.before :each, js: true do
    WebMock.allow_net_connect!
    Capybara.current_driver = :selenium
  end
end

Capybara.default_selector = :css

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, { browser: :chrome })
end
