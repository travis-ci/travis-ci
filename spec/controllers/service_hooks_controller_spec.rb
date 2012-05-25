require 'spec_helper'

RSpec.configure do |t|
  t.backtrace_clean_patterns = []
end

describe ServiceHooksController do
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
        put :update, :id => 1, :name => 'minimal', :owner_name => 'svenfuchs', :active => 'true'

        Repository.count.should == 1
        Repository.first.active?.should be_true

        assert_requested(:post, 'https://api.github.com/hub', :times => 1)
      end

      it 'updates an existing repository if it exists' do
        put :update, :id => 1, :name => 'minimal', :owner_name => 'svenfuchs', :active => 'true'

        Repository.count.should == 1
        Repository.first.active?.should be_true

        assert_requested(:post, 'https://api.github.com/hub', :times => 1)
      end
    end

    context 'unsubscribes from the service hook' do
      it 'updates an existing repository' do
        put :update, :id => 1, :name => 'minimal', :owner_name => 'svenfuchs', :active => 'false'

        Repository.first.active?.should be_false

        assert_requested(:post, 'https://api.github.com/hub', :times => 1)
      end
    end
  end
end

