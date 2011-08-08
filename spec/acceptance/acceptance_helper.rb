require File.expand_path('../../spec_helper', __FILE__)
require 'rspec'
require 'capybara/rspec'
require 'webmock'

load_all File.expand_path('../support/**/*.rb', __FILE__)

Capybara.default_selector  = :css
Capybara.javascript_driver = :selenium

# Capybara's default driver is Rack::Test
Capybara.register_driver :selenium do |app|
  require "selenium-webdriver"
  Capybara::Selenium::Driver.new(app, { :browser => :chrome })
end
