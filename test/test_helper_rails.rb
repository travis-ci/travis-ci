ENV["RAILS_ENV"] = "test"

require 'test_helper'
require File.expand_path('../../config/environment', __FILE__)

require 'factories'
require 'database_cleaner'
DatabaseCleaner.strategy = :truncation

class Test::Unit::TestCase
  def setup
    DatabaseCleaner.start
  end

  def teardown
    DatabaseCleaner.clean
  end
end
