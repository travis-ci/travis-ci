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
  include TestHelpers::GithubApi
  include TestHelpers::Redis

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
      Resque.expects(:enqueue).with(Travis::Worker,
                                    {'build' => {'id' => 1, 'branch' => 'master', 'commit' => '9854592'}, 'repository' => {'id' => 1, :slug => 'svenfuchs/gem-release'}, :queue => 'builds'})

      payload = GITHUB_PAYLOADS['gem-release']
      lambda {
        post :create, :payload => payload
      }.should change(Request, :count).by(1)

      task = Request.all.first.task

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
      Resque.expects(:enqueue).with(Travis::Worker, {'build' => {'id' => 2, 'branch' => 'master', 'commit' => '62aae5f70ceee39123ef'}, 'repository' => {'id' => 2, :slug => 'svenfuchs/minimal'}, :queue => 'builds'})
      Resque.expects(:enqueue).with(Travis::Worker, {'build' => {'config' => {}, 'id' => 3, 'number' => '.1', 'branch' => 'master', 'commit' => '62aae5f70ceee39123ef'}, 'repository' => {'id' => 2, :slug => 'svenfuchs/minimal'}, :queue => 'builds'})

      lambda {
        put :update, :id => _request.id, :payload => payload
      }.should change(Task, :count).by(2)
    end
  end
end
