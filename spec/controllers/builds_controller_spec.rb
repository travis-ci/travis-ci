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
  let(:build)     { Factory(:build).reload }
  let(:user)      { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
  let(:auth)      { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }

  let(:pusher)    { Support::Mocks::Pusher.new }
  let(:channel)   { Support::Mocks::Channel.new }
  let(:queue)     { Travis::Notifications::Worker.default_queue }

  before(:each) do
    Travis.config.notifications = [:worker, :pusher]
    Travis::Notifications::Pusher.any_instance.stubs(:channel).returns(pusher)

    Pusher.stubs(:[]).returns(channel)
    request.env['HTTP_AUTHORIZATION'] = auth
  end

  describe 'POST :create' do
    let(:payload) { GITHUB_PAYLOADS['gem-release'] }

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

  describe 'PUT update' do
    let(:payloads) {
      {
        :config => { 'build' => { 'config' => { 'rvm' => ['1.8.7', '1.9.2'] } } },
        :start  => { 'build' => { 'started_at' => '2011-06-16 22:59:41 +0200' } },
        :log    => { 'build' => { 'log' => '... appended' } },
        :finish => { 'build' => { 'finished_at' => '2011-06-16 22:59:41 +0200', 'status' => 1, 'log' => 'final build log' } },
      }
    }

    describe 'a config payload' do
      it "finishes the request's configure task" do
        request = Factory(:request)
        put :update, payloads[:config].merge(:id => request.task.id)
        request.reload.task.should be_finished
      end

      it 'finishes the request' do
        request = Factory(:request)
        put :update, payloads[:config].merge(:id => request.task.id)
        request.reload.should be_finished
      end

      it 'creates a new build' do
        request = Factory(:request)
        update = lambda { put :update, payloads[:config].merge(:id => request.task.id) }
        update.should change(Build, :count).by(1)
        request.builds.should_not be_empty
      end

      it "creates the build's matrix test tasks" do
        request = Factory(:request)
        update = lambda { put :update, payloads[:config].merge(:id => request.task.id) }
        update.should change(Task::Test, :count).by(2)
        request.builds.first.matrix.should_not be_empty
      end
    end

    describe 'a task start payload' do
      let(:build) { Factory(:build) }
      let(:task)  { build.matrix.first }

      before :each do
        put :update, payloads[:start].merge(:id => task.id)
      end

      it 'starts the task' do
        task.reload.should be_started
      end

      it 'starts the build' do
        build.reload.should be_started
      end
    end

    describe 'a task log payload' do
      let(:build) { Factory(:build) }
      let(:task)  { build.matrix.first }

      before :each do
        put :update, payloads[:log].merge(:id => task.id)
      end

      it "appends the log output to the task's log" do
        task.reload.log.should == '... appended'
      end
    end

    describe 'a task finish payload' do
      let(:build) { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }

      it 'finishes a matrix test task' do
        task = build.matrix.first
        put :update, payloads[:finish].merge(:id => task)
        task.reload.should be_finished
      end

      it 'but does not finish the build if a task is still pending' do
        put :update, payloads[:finish].merge(:id => build.matrix.first.id)
        build.reload.should_not be_finished
      end

      it 'and finishes the build if all tasks are finished' do
        build.matrix.each do |task|
          put :update, payloads[:finish].merge(:id => task.id)
        end
        build.reload.should be_finished
      end
    end
  end

  describe 'GET :index' do
    it 'returns a list of builds in json'
  end

  describe 'GET :show' do
    it 'returns build details in json'
  end
end

