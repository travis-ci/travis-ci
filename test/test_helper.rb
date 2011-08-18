ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

require 'factory_girl'
require 'fakeredis'
require 'mocha'
require 'test_declarative'

require 'travis'

# load all the test helpers
Dir["#{File.expand_path('../test_helpers/**/*.rb', __FILE__)}"].each do |helper|
  require helper
end

class ActiveSupport::TestCase
  include TestHelpers::Assertions
  include TestHelpers::Redis
  DatabaseCleaner.strategy = :truncation
  def setup
    Time.zone = 'UTC'
    Mocha::Mockery.instance.verify
    Travis.pusher = TestHelpers::Mocks::Pusher.new
    Resque.redis  = Redis.new
    DatabaseCleaner.start
    super
  end

  def teardown
    Travis.pusher = nil
    DatabaseCleaner.clean
    Mocha::Mockery.instance.teardown
    Mocha::Mockery.reset_instance
    super
  end
end
