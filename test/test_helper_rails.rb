ENV["RAILS_ENV"] = "test"
require File.expand_path('../../config/environment', __FILE__)
require 'test_helper'
require 'rails/test_help'

class ActiveSupport::TestCase
  DatabaseCleaner.strategy = :truncation

  def setup
    DatabaseCleaner.start
    super
  end

  def teardown
    DatabaseCleaner.clean
    super
  end
end

