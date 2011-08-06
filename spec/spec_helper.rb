# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'capybara/rspec'
require 'webmock'
require 'patches/rspec_hash_diff'

Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  config.mock_with :rspec

  config.include Devise::TestHelpers, :type => :controller
  config.include JsonHelpers

  # config.before(:each, :webmocked => true) do
  #   self.extend WebMock::API
  #   WebMock.disable_net_connect!(:allow_localhost => true)
  # end

  config.before :suite do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with :truncation
  end

  config.before :each do
    DatabaseCleaner.start
  end

  config.after :each do
    DatabaseCleaner.clean
  end
end

WebMock.disable_net_connect!(:allow_localhost => true)
