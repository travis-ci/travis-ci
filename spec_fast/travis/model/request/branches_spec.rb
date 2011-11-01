require 'spec_helper'

describe Request::Branches do
  include Request::Branches

  describe '#branch_included?' do
    it 'returns true if the included branches include the given branch' do
      stubs(:included_branches).returns(['master'])
      branch_included?('master').should be_true
    end

    it 'returns true if no branches are included' do
      stubs(:included_branches).returns(nil)
      branch_included?('master').should be_true
    end

    it 'returns false if the included branches do not include the given branch' do
      stubs(:included_branches).returns(['master'])
      branch_included?('staging').should be_false
    end
  end

  describe '#branch_excluded?' do
    it 'returns true if the excluded branches include the given branch' do
      stubs(:excluded_branches).returns(['master'])
      branch_excluded?('master').should be_true
    end

    it 'returns false if no branches are excluded' do
      stubs(:excluded_branches).returns(nil)
      branch_excluded?('master').should be_false
    end

    it 'returns false if the included branches do not include the given branch' do
      stubs(:excluded_branches).returns(['master'])
      branch_excluded?('staging').should be_false
    end
  end

  describe 'included_branches' do
    it 'returns the :only value from the branches config' do
      stubs(:branches_config).returns(:only => ['master'])
      included_branches.should == ['master']
    end
  end

  describe 'excluded_branches' do
    it 'returns the :except value from the branches config' do
      stubs(:branches_config).returns(:except => ['master'])
      excluded_branches.should == ['master']
    end
  end

  describe 'branches_config' do
    it 'returns an empty array if the config is not a Hash' do
      stubs(:config).returns(nil)
      branches_config.should == {}
    end

    it 'returns an empty array if the config does not have a :branches value' do
      stubs(:config).returns(nil)
      branches_config.should == {}
    end

    it 'returns the :branches value if it is a hash' do
      stubs(:config).returns({ :branches => { :only => ['foo', 'bar'] } })
      branches_config.should == { :only => ['foo', 'bar']}
    end

    it 'returns an array of strings if the :branches value is a string, splitted at commas and stripped' do
      stubs(:config).returns(:branches => 'foo, bar')
      branches_config.should == { :only => ['foo', 'bar']}
    end
  end
end
