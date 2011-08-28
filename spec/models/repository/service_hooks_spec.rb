require 'spec_helper'

describe Repository::ServiceHooks do
  describe 'active_by_name' do
    it 'returns a hash of active by name attributes (can be scoped)' do
      Factory(:repository, :active => true, :owner_name => 'svenfuchs', :name => 'minimal')
      Factory(:repository, :active => false, :owner_name => 'svenfuchs', :name => 'gem-release')
      Factory(:repository, :active => true, :owner_name => 'josevalim', :name => 'enginex')

      result = Repository.where(:owner_name => 'svenfuchs').active_by_name
      result.should == { 'minimal' => true, 'gem-release' => false }
    end
  end

  describe 'toggle' do
    let(:user)       { Factory(:user) }
    let(:repository) { Factory(:repository) }

    it 'given true it activates a service hook' do
      stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})

      repository.service_hook.toggle(true, user)
      repository.should be_persisted
      repository.should be_active
    end

    it 'given false it removes a service hook' do
      stub_request(:post, 'https://api.github.com/hub').to_return(:status => 200, :body => '', :headers => {})

      repository.service_hook.toggle(false, user)
      repository.should be_persisted
      repository.should_not be_active
    end
  end
end
