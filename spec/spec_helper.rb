ENV["RAILS_ENV"] ||= 'test'

def require_all(*patterns)
  options = patterns.pop
  patterns.each { |pattern| Dir[pattern].sort.each { |path| require path.gsub(/^#{options[:relative_to]}\//, '') } }
end

require File.expand_path('../../config/environment', __FILE__)
require 'rspec/rails'
require 'capybara/rspec'
require 'database_cleaner'
require 'factory_girl'
require 'patches/rspec_hash_diff'
require 'webmock'
require 'stringio'

require_all 'spec/support/**/*.rb', :relative_to => 'spec'
require_all 'spec/client/support/**/*.rb', :relative_to => 'spec'

require 'travis/support'
require 'travis/support/testing/webmock'

Travis.logger = Logger.new(StringIO.new)

RSpec.configure do |c|
  c.filter_run_excluding :js => true if ENV['CI']
  c.mock_with :mocha
  # c.backtrace_clean_patterns.clear

  Support.constants.each do |constant|
    c.include Support.const_get(constant)
  end

  c.before :suite do
    DatabaseCleaner.strategy = :truncation
    DatabaseCleaner.clean_with :truncation
  end

  c.before :each do
    DatabaseCleaner.start
    pusher.reset!

    Travis.instance_variable_set(:@config, nil)
    Travis.config.domain = 'test.travis-ci.org'

    Travis::Event::Handler.instance_variable_set(:@subscriptions, nil)
    Travis::Event::Handler::Worker.instance_variable_set(:@queues, nil)
    # Travis::Event::Handler::Worker.amqp = Support::Mocks::Amqp.new

    Travis::Support::Testing::Webmock.mock!
  end

  c.after :each do
    DatabaseCleaner.clean
  end

  c.alias_example_to :fit, :focused => true
  c.filter_run :focused => true
  c.run_all_when_everything_filtered = true
end

WebMock.disable_net_connect!(:allow_localhost => true)
