begin
  require 'ruby-debug'
rescue LoadError => e
  puts e.message
end
require 'bundler/setup'

require 'active_record'
require 'test/unit'
require 'test_declarative'
require 'mocha'
require 'fakeredis'
require 'resque'

require 'travis'

Dir["#{File.expand_path('../test_helpers/**/*.rb', __FILE__)}"].each do |helper|
  require helper
end

class Test::Unit::TestCase
  include Assertions, TestHelper::Buildable, TestHelper::Redis

  def setup
    Mocha::Mockery.instance.verify
    Resque.redis = FakeRedis::Redis.new
  end
end

# class TestMochaTest < ActiveSupport::TestCase
#   def test_mocha_expectation
#     object = Object.new
#     object.expects(:foo)
#   end
# end
