Dir['spec/client/support/**/*.rb'].sort.each { |path| require File.expand_path(path) }

require 'spec_helper'
require 'rspec'
require 'capybara/rspec'
require 'webmock'

RSpec.configure do |config|
  config.before :each, :js => true do
    Capybara.current_driver = :selenium
  end
end

Capybara.default_selector = :css

Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, { :browser => :chrome })
end
