require File.expand_path(File.dirname(__FILE__) + "/../spec_helper")
require 'rspec'
require 'capybara/rspec'
require 'webmock'

Dir["#{File.dirname(__FILE__)}/support/**/*.rb"].each {|f| require f}

Capybara.default_selector = :css
Capybara.javascript_driver = :selenium

# Capybara's default driver is Rack::Test
Capybara.register_driver :selenium do |app|
  require "selenium-webdriver"
  Capybara::Selenium::Driver.new(app, { :browser => :chrome })
end
WebMock.disable_net_connect!(:allow_localhost => true)


