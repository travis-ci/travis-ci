ENV["RAILS_ENV"] = "test"

require File.expand_path('../../config/environment', __FILE__)
require 'test_helper'
require 'rails/test_help'

require 'factories'
require 'database_cleaner'
DatabaseCleaner.strategy = :truncation

class Test::Unit::TestCase
  class BuildableMock
    def configure; end
    def build!; end
  end

  def setup
    DatabaseCleaner.start
  end

  def teardown
    DatabaseCleaner.clean
  end
end
