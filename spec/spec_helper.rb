# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'
require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'capybara/rspec'
require 'webmock'

Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

RSpec.configure do |config|
  config.mock_with :rspec

  config.include Devise::TestHelpers, :type => :controller
  config.include Devise::TestHelpers, :type => :controller

  # config.before(:each, :webmocked => true) do
  #   self.extend WebMock::API
  #   WebMock.disable_net_connect!(:allow_localhost => true)
  # end
end

WebMock.disable_net_connect!(:allow_localhost => true)
