require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")
require "steak"

# Put your acceptance spec helpers inside /spec/acceptance/support
Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each {|f| require f}
require "selenium-webdriver"

RSpec.configure do |config|
  config.before(:each) do
    Capybara.current_driver = :selenium
  end
end

Capybara.default_selector = :css

Capybara.register_driver :selenium do |app|
  Capybara::Driver::Selenium.new(app, { :browser => :chrome })
end

