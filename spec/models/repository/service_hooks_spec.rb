require 'spec_helper'

describe Repository::ServiceHooks do
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
