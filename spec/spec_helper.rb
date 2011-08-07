# This file is copied to spec/ when you run 'rails generate rspec:install'
ENV["RAILS_ENV"] ||= 'test'

begin
  require 'rubygems'
  require 'spork'
rescue LoadError => e
end

def configure
  require File.expand_path("../../config/environment", __FILE__)
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}
  require 'rspec/rails'
  require 'capybara/rspec'
  require 'webmock'
  require 'patches/rspec_hash_diff'
end

if defined? Spork
  Spork.prefork do
    configure
  end

  Spork.each_run do
    Dir["#{Rails.root}/app/**/*.rb"].each { |f| load f }
    Dir["#{Rails.root}/lib/**/*.rb"].each { |f| load f }
    load "#{Rails.root}/config/routes.rb"
  end
else
  configure
end

RSpec.configure do |config|
  config.mock_with :mocha

  config.include Devise::TestHelpers, :type => :controller
  config.include TestHelpers::Json

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
