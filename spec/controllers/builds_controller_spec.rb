require 'spec_helper'

RSpec::Matchers.define :be_in_queue do
  match do |build|
    args = Resque.reserve(:tasks).args.last
    build.commit.should eql '9854592'
    args['build'].slice('id', 'commit').should eql build.attributes.slice('id', 'commit')
    args['repository'].slice('id').should      eql build.repository.attributes.slice('id')
  end
end

describe BuildsController do
  include TestHelpers::GithubApiTestHelper
  include TestHelpers::RedisHelper

  let(:_request) { Factory(:request).reload }
  let(:build) { Factory(:build).reload }
  let(:channel) { TestHelpers::Mocks::Channel.new }
  let(:user) { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
  let(:credentials) { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }

  before(:each) do
    flush_redis
    Pusher.stubs(:[]).returns(channel)
    request.env['HTTP_AUTHORIZATION'] = credentials
  end

  describe "POST 'create' (ping from github)" do
    it 'creates a Request record and configure task and enqueues configure task' do
      payload = GITHUB_PAYLOADS['gem-release']
      lambda {
        post :create, :payload => payload
      }.should change(Request, :count).by(1)

      Resque.expects(:enqueue).with(Request.all.first.task)
      Request.all.first.task.should_not be_nil
    end

    it 'does not create a build record when the branch is gh_pages' do
      lambda {
        post :create, :payload => GITHUB_PAYLOADS['gh-pages-update']
      }.should_not change(Request, :count)
    end
  end

  describe "PUT 'update'" do
    let(:payload) {
      { "build" => { "config" => { "script" => "rake", "rvm" => ["1.8.7", "1.9.2"], "gemfile" => ["gemfiles/rails-2.3.x", "gemfiles/rails-3.0.x"] } } }
    }
    it 'configures the build and expands a given build matrix' do
      # put :update, :id => request.id, WORKER_PAYLOADS[:configured].merge('msg_id' => msg_id)

    end
  end
end
