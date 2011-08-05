require 'test_helper'
require 'core_ext/hash/compact'

describe "CoreExtHash", ActiveSupport::TestCase do
  it 'Hash#compact' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    hash.compact.should == expected
  end

  it 'Hash#compact!' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    hash.compact!
    hash.should == expected
  end
end
