require 'spec_helper'

feature 'The build process' do
  include Rack::Test::Methods, TestHelpers::GithubApi, TestHelpers::Walkthrough

  before(:each) do
    # TODO extract stub_pusher or something
    Travis.config.notifications = [:worker, :pusher]
    Travis::Notifications::Pusher.any_instance.stubs(:channel).returns(pusher)
    pusher.reset!
    mock_github_api
  end

  let(:pusher) { TestHelpers::Mocks::Pusher.new }

  scenario 'creates a request from a github payload, configures it, creates the build and runs the tests', :driver => :rack_test do
    ping_from_github!

    _request.should be_created
    pusher.should have_message('build:queued')           # for client compat. should be task:configure:created
    task.should be_queued

    worker.start!(task, 'build' => { 'started_at' => Time.now })
    # pusher.should have_message('task:configure:started') # not currently used.

    worker.finish!(task, 'build' => { 'config' => { 'rvm' => ['1.8.7', '1.9.2'] } })

    _request.should be_finished
    build.should be_created
    pusher.should have_message('task:configure:finished') # not currently used.

    task.should_not be_queued
    build.matrix.each { |task| task.should be_queued }
    api.repositories.should_not include(json_for(repository))

    while next_task!
      worker.start!(task, :build => { 'started_at' => Time.now })

      task.should be_started
      build.should be_started
      pusher.should have_message('build:started')

      api.repositories.should include(json_for(repository))
      # api.build(build).should include(json_for(build))
      # api.task(task).should include(json_for(task))

      worker.log!(task, :build => { 'log' => 'foo' })
      task.log.should == 'foo'
      pusher.should have_message('build:log', :log => 'foo')

      worker.finish!(task, :build => { 'finished_at' => Time.now, 'status' => 0, 'log' => 'foo bar'})
      task.should be_finished
      pusher.should have_message('task:test:finished')   # not currently used.
      # api.task(task).should include(json_for(task))
    end

    build.should be_finished
    build.status.should == 0
    # api.build(build).should include(json_for(build))

    repository.should have_last_build(build)
    api.repositories.should include(json_for(repository))

    pusher.should have_message('build:finished')
  end
end
