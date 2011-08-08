require 'rubygems'

ENV["RAILS_ENV"] ||= 'test'

begin
  require 'rubygems'
  require 'spork'
rescue LoadError => e
end

def load_all(*patterns)
  patterns.each { |pattern| Dir[pattern].sort.each { |path| load path } }
end

def configure
  require File.expand_path("../../config/environment", __FILE__)
  load_all 'spec/support/**/*.rb'
  require 'rspec/rails'
  require 'capybara/rspec'
  require 'webmock'
  require 'patches/rspec_hash_diff'
end

if defined?(Spork)
  Spork.prefork  { configure }
  Spork.each_run { load_all '{app,lib}/**/*.rb', '/config/routes.rb' }
else
  configure
end

RSpec.configure do |config|
  config.mock_with :mocha

  config.include Devise::TestHelpers, :type => :controller
  config.include TestHelpers::Json

  config.before :suite do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with :truncation
  end

  config.before :each do
    DatabaseCleaner.start
  end

  config.after :each do
    DatabaseCleaner.clean
    Travis.instance_variable_set(:@config, nil)
    Travis::Notifications.instance_variable_set(:@subscriptions, nil)
  end
end

WebMock.disable_net_connect!(:allow_localhost => true)
