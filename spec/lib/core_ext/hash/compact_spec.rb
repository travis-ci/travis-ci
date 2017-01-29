require 'spec_helper'
require 'core_ext/hash/compact'

describe Hash, 'extensions' do
  it 'compact' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    hash.compact.should == expected
  end

  it 'compact!' do
    hash     = { :a => :b, :c => nil }
    expected = { :a => :b }

    hash.compact!
    hash.should == expected
  end
end
