ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'test_helper'
require 'rails/test_help'

class ActiveSupport::TestCase
  DatabaseCleaner.strategy = :truncation

  def setup
    Travis.pusher = Mocks::Pusher.new
    Resque.redis = FakeRedis::Redis.new
    DatabaseCleaner.start
    super
  end

  def teardown
    Travis.pusher = nil
    DatabaseCleaner.clean
    super
  end
end

