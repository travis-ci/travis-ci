ENV["RAILS_ENV"] ||= 'test'

# begin
#   require 'rubygems'
#   require 'spork'
# rescue LoadError => e
# end

def load_all(*patterns)
  patterns.each { |pattern| Dir[pattern].sort.each { |path| load File.expand_path(path) } }
end

def configure
  require File.expand_path("../../config/environment", __FILE__)
  require 'capybara/rspec'
  require 'database_cleaner'
  require 'factory_girl'
  require 'fakeredis'
  require 'patches/rspec_hash_diff'
  require 'rspec/rails'
  require 'webmock'
  load_all 'spec/support/**/*.rb'

  RSpec.configure do |c|
    c.filter_run_excluding :js => true if ENV['CI']

    c.mock_with :mocha

    Support.constants.each do |constant|
      c.include Support.const_get(constant)
    end

    c.before :suite do
      DatabaseCleaner.strategy = :truncation
      DatabaseCleaner.clean_with :truncation
    end

    c.before :each do
      DatabaseCleaner.start
      Resque.redis.flushall
      pusher.reset!

      Travis.instance_variable_set(:@config, nil)
      Travis::Notifications.instance_variable_set(:@subscriptions, nil)
      Travis::Notifications::Worker.instance_variable_set(:@queues, nil)
    end

    c.before :each, :webmock => true do
      Support::GithubApi.mock!
    end

    c.after :each do
      DatabaseCleaner.clean
    end
  end

  WebMock.disable_net_connect!(:allow_localhost => true)
end

if defined?(Spork)
  Spork.prefork  { configure }
  Spork.each_run { load_all 'lib/**/*.rb', '/config/routes.rb' }
else
  configure
end

