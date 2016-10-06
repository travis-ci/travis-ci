require 'test_helper'
require 'core_ext/hash/compact'

class CoreExtHashTest < ActiveSupport::TestCase
  test 'Hash#compact' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    assert_equal expected, hash.compact
  end

  test 'Hash#compact!' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    hash.compact!
    assert_equal expected, hash
  end
end
