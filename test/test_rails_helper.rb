ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)

require 'factories'
require 'database_cleaner'
DatabaseCleaner.strategy = :truncation

module Test::Unit::DatabaseCleaner
  def setup
    DatabaseClener.start
  end

  def teardown
    DatabaseCleaner.clean
  end

  Test::Unit::TestCase.send(:include, self)
end


