require 'spec_helper'

describe TasksController do
  describe 'GET :show' do
    let(:test)       { Factory(:build).matrix.first.reload }
    let(:repository) { test.repository }

    it 'in json' do
      get :show, :id => test.id, :format => 'json'
      json_response.should == json_for_http(test)
    end
  end

  describe 'PUT update' do
    let(:build)     { Factory(:build).reload }
    let(:user)      { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
    let(:auth)      { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }

    before(:each) do
      Travis.config.notifications = [:pusher]
      request.env['HTTP_AUTHORIZATION'] = auth
    end

    describe 'a config payload' do
      let(:payload) { { 'build' => { 'config' => { 'rvm' => ['1.8.7', '1.9.2'] } } } }

      it "finishes the request's configure task" do
        request = Factory(:request)
        put :update, payload.merge(:id => request.task.id)
        request.reload.task.should be_finished
      end

      it 'finishes the request' do
        request = Factory(:request)
        put :update, payload.merge(:id => request.task.id)
        request.reload.should be_finished
      end

      it 'creates a new build' do
        request = Factory(:request)
        update = lambda { put :update, payload.merge(:id => request.task.id) }
        update.should change(Build, :count).by(1)
        request.builds.should_not be_empty
      end

      it "creates the build's matrix test tasks" do
        request = Factory(:request)
        update = lambda { put :update, payload.merge(:id => request.task.id) }
        update.should change(Task::Test, :count).by(2)
        request.builds.first.matrix.should_not be_empty
      end
    end

    describe 'a task start payload' do
      let(:payload) { { 'build' => { 'started_at' => '2011-06-16 22:59:41 +0200' } } }
      let(:build)   { Factory(:build) }
      let(:task)    { build.matrix.first }

      before :each do
        put :update, payload.merge(:id => task.id)
      end

      it 'starts the task' do
        task.reload.should be_started
      end

      it 'starts the build' do
        build.reload.should be_started
      end
    end

    describe 'a task log payload' do
      let(:payload) { { 'build' => { 'log' => '... appended' } } }
      let(:build)   { Factory(:build) }
      let(:task)    { build.matrix.first }

      before :each do
        put :update, payload.merge(:id => task.id)
      end

      it "appends the log output to the task's log" do
        task.reload.log.should == '... appended'
      end
    end

    describe 'a task finish payload' do
      let(:payload) { { 'build' => { 'finished_at' => '2011-06-16 22:59:41 +0200', 'status' => 1, 'log' => 'final build log' } } }
      let(:build)   { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }
      let(:task)    { build.matrix.first }

      it 'finishes a matrix test task' do
        put :update, payload.merge(:id => task)
        task.reload.should be_finished
      end

      it 'but does not finish the build if a task is still pending' do
        put :update, payload.merge(:id => task.id)
        build.reload.should_not be_finished
      end

      it 'and finishes the build if all tasks are finished' do
        build.matrix.each do |task|
          @controller = TasksController.new # TODO wtf! it would otherwise keep the instance and thus memoized ivars??
          put :update, payload.merge(:id => task.id)
        end
        build.reload.should be_finished
      end
    end
  end
end
