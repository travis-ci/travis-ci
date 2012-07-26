require 'spec_helper'

describe V2::ServiceHooksController do
  let(:user) { Factory(:user, :github_oauth_token => 'github_oauth_token') }
  let(:repo) { Factory(:repository) }

  before :each do
    user.permissions.create!(:repository => repo, :user => user, :admin => true)
    sign_in_user user
  end

  describe 'GET :index' do
    it 'should return repositories of current user' do
      get(:index, :format => 'json')
      response.should be_success

      result = json_response['service_hooks']
      result.first['name'].should   == repo.name
      result.first['owner_name'].should  == repo.owner_name
    end
  end

  describe 'PUT :update' do
    before(:each) do
      stub_request(:post, 'https://api.github.com/hub').to_return(:body => '[]')
    end

    it 'subscribes to a service hook if active => true was given' do
      put :update, :id => 'svenfuchs:minimal', :name => 'minimal', :owner_name => 'svenfuchs', :service_hook => { :active => true }

      repo.reload.active?.should be_true
      assert_requested(:post, 'https://api.github.com/hub', :times => 1)
    end

    it 'unsubscribes from the service hook if active => false was given' do
      put :update, :id => 'svenfuchs:minimal', :name => 'minimal', :owner_name => 'svenfuchs', :service_hook => { :active => false }

      repo.reload.active?.should be_false
      assert_requested(:post, 'https://api.github.com/hub', :times => 1)
    end
  end
end

