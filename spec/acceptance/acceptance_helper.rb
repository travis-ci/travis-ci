require File.expand_path('../../spec_helper', __FILE__)
require 'rspec'
require 'capybara/rspec'
require 'webmock'

load_all File.expand_path('../support/**/*.rb', __FILE__)

RSpec.configure do |config|
  config.before :each, :js => true do
    Capybara.current_driver = :selenium
  end

  config.include AcceptanceHelpers
  config.include NavigationHelpers
end

Capybara.default_selector = :css

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, { :browser => :chrome })
end
