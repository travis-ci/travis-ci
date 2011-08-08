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
  # include TestHelpers::GithubApi
  include TestHelpers::Redis

  let(:pusher) { TestHelpers::Mocks::Pusher.new }

  let(:_request) { Factory(:request).reload }
  let(:build) { Factory(:build).reload }
  let(:channel) { TestHelpers::Mocks::Channel.new }
  let(:user) { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
  let(:credentials) { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }
  let(:queue) { Travis::Notifications::Worker.default_queue }

  before(:each) do
    flush_redis

    Travis.config.notifications = [:worker, :pusher]
    Travis::Notifications::Pusher.any_instance.stubs(:channel).returns(pusher)

    Pusher.stubs(:[]).returns(channel)
    request.env['HTTP_AUTHORIZATION'] = credentials
  end

  describe "POST :create" do
    it "should create a Request including its commit on repository" do
      payload = GITHUB_PAYLOADS['gem-release']

      lambda { post :create, :payload => payload }.should change(Request, :count).by(1)

      build_request = Request.all.first
      build_request.should be_created
      build_request.payload.should eql payload
      build_request.task.should be_queued
    end

    it 'does not create a build record when the branch is gh_pages'
  end

  describe "PUT update" do
    let(:config_payload) {
      { "build" => { "config" => { "script" => "rake", :rvm => ["1.8.7", "1.9.2"], :gemfile => ["gemfiles/rails-2.3.x", "gemfiles/rails-3.0.x"] } } }
    }

    let(:finish_payload) {
      { "build" => { "finished_at" => "2011-06-16 22:59:41 +0200", "status" => 1, "log" => "final build log" } }
    }

    let(:log_payload) {
      { "build" => { "log" => " ... appended" } }
    }

    let(:started_payload) {
      { "build" => { "started_at" => "2011-06-16 22:59:41 +0200" } }
    }
    let(:finished_payload){
      { "build" => { "finished_at" => "2011-06-16 22:59:41 +0200", "status" => 1, "log" => "final build log" } }
    }

    it "finishes the request and creates a build" do
      _request

      lambda {
        put :update, :id => _request.id, :payload => config_payload
      }.should change(Task, :count).by(4)
    end

    it 'starts the build' do

    end

    it "finishes the build"
    it 'finishes a matrix build'
  end

  describe "GET /builds" do
    it "should return builds array JSON" do

    end
  end

  describe "GET /build" do
    it "should return build details JSON"
  end
  describe "PUT /builds/:id" do
    it 'appends to the build log'
  end
end

