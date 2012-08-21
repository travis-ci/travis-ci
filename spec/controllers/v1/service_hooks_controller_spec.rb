require 'spec_helper'

describe V1::ServiceHooksController do
  let(:user)       { Factory(:user, :login => 'svenfuchs', :github_oauth_token => 'github_oauth_token') }
  let(:repository) { Factory(:repository, :owner_name => 'svenfuchs', :name => 'minimal') }
  let(:hooks_url)  { 'repos/svenfuchs/minimal/hooks' }
  let(:hook_url)   { "https://api.github.com/repos/svenfuchs/minimal/hooks/77103" }
  let(:active)     { GH.load GITHUB_PAYLOADS['hook_active'] }
  let(:inactive)   { GH.load GITHUB_PAYLOADS['hook_inactive'] }

  alias repo repository

  def update_payload(active)
    {
      :name   => 'travis',
      :events => ServiceHook::EVENTS,
      :active => active,
      :config => { :user => user.login, :token => user.tokens.first.token, :domain => 'staging.travis-ci.org' }
    }
  end

  before :each do
    Travis.config.stubs(:service_hook_url).returns('staging.travis-ci.org')
    GH.stubs(:[]).with(hooks_url).returns([])

    user.permissions.create!(:repository => repo, :user => user, :admin => true)
    sign_in_user user
  end

  describe 'GET :index' do
    it 'should return repositories of current user' do
      get(:index, :format => 'json')
      response.should be_success

      result = json_response
      result.first['name'].should   == repo.name
      result.first['owner_name'].should  == repo.owner_name
    end
  end

  describe 'PUT :update' do
    before(:each) do
      stub_request(:post, 'https://api.github.com/hub').to_return(:body => '[]')
    end

    context 'subscribes to a service hook' do
      it 'creates a repository if it does not exist' do
        GH.expects(:post).with(hooks_url, update_payload(true)).returns(active)
        put :update, :id => 'svenfuchs:minimal', :name => 'minimal', :owner_name => 'svenfuchs', :active => 'true'

        Repository.count.should == 1
        Repository.first.active?.should be_true
      end

      it 'updates an existing repository if it exists' do
        GH.stubs(:[]).with(hooks_url).returns([inactive])
        GH.expects(:patch).with(hook_url, update_payload(true)).returns(active)
        put :update, :id => 'svenfuchs:minimal', :name => 'minimal', :owner_name => 'svenfuchs', :active => 'true'

        Repository.count.should == 1
        Repository.first.active?.should be_true
      end
    end

    context 'unsubscribes from the service hook' do
      it 'updates an existing repository' do
        GH.stubs(:[]).with(hooks_url).returns([active])
        GH.expects(:patch).with(hook_url, update_payload(false)).returns(inactive)
        put :update, :id => 'svenfuchs:minimal', :name => 'minimal', :owner_name => 'svenfuchs', :active => 'false'

        Repository.first.active?.should be_false
      end
    end
  end
end

