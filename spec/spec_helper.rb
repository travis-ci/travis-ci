ENV["RAILS_ENV"] ||= 'test'

def load_all(*patterns)
  patterns.each { |pattern| Dir[pattern].sort.each { |path| load File.expand_path(path) } }
end

def require_all(*patterns)
  options = patterns.pop
  patterns.each { |pattern| Dir[pattern].sort.each { |path| require path.gsub(/^#{options[:relative_to]}\//, '') } }
end

require File.expand_path("../../config/environment", __FILE__)
require 'rspec/rails'
require 'patches/rspec_hash_diff'
require 'capybara/rspec'
require 'webmock'
require 'fakeredis'
require 'factory_girl'
require_all 'spec/support/**/*.rb', :relative_to => 'spec'

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

