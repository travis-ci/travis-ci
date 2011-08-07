require 'spec_helper'

describe ServiceHooksController do
  include Devise::SignInHelpers, TestHelpers::GithubApi

  before(:each) do
    mock_github_api
    sign_in_user user
  end

  let(:user) { Factory(:user, :github_oauth_token => 'github_oauth_token') }

  describe 'GET :index' do
    it 'should return repositories of current user' do
      get(:index, :format => 'json')

      response.should be_success

      ## FIXME: probably it makes sense to verify these things agains a complete json, even though we care most about these fields
      result = ActiveSupport::JSON.decode response.body

      result.first['name'].should   eql('safemode')
      result.first['owner'].should  eql('svenfuchs')
      result.second['name'].should  eql('scriptaculous-sortabletree')
      result.second['owner'].should eql('svenfuchs')
    end
  end

  describe 'PUT :update' do
    before(:each) do
      stub_github_api_post
    end

    context 'subscribes to a service hook' do
      it 'creates a repository if it does not exist' do
        put :update, :name => 'minimal', :owner => 'svenfuchs', :active => true

        Repository.count.should eql(1)
        Repository.first.active?.should eql(true)

        assert_requested(:post, 'https://api.github.com/hub?access_token=github_oauth_token', :times => 1)
      end

      it 'updates an existing repository if it exists' do
        repository = Factory(:repository)

        put :update, :name => 'minimal', :owner => 'svenfuchs', :active => true

        Repository.count.should eql(1)
        Repository.first.active?.should eql(true)

        assert_requested(:post, 'https://api.github.com/hub?access_token=github_oauth_token', :times => 1)
      end
    end

    context 'unsubscribes from the service hook' do
      it 'updates an existing repository' do
        repository = Factory(:repository)

        put :update, :name => 'minimal', :owner => 'svenfuchs', :active => false

        Repository.first.active?.should eql(false)

        assert_requested(:post, 'https://api.github.com/hub?access_token=github_oauth_token', :times => 1)
      end
    end
  end
end

