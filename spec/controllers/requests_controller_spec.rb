require 'spec_helper'

describe RequestsController do
  describe 'POST :create' do

    let(:user)    { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
    let(:auth)    { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }
    let(:payload) { GITHUB_PAYLOADS['gem-release'] }

    before(:each) do
      Travis.config.notifications = [:worker]
      request.env['HTTP_AUTHORIZATION'] = auth
    end

    it 'should create a Request including its commit on repository' do
      create = lambda { post :create, :payload => payload }
      create.should change(Request, :count).by(1)

      request = Request.last
      request.should be_created
      request.payload.should == payload
      request.task.should be_queued
    end

    it 'does not create a build record when the branch is gh_pages' do
      create = lambda { post :create, :payload => payload.gsub('refs/heads/master', 'refs/heads/gh_pages') }
      create.should_not change(Request, :count)
    end
  end
end

