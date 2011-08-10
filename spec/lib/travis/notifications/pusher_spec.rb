require 'spec_helper'

describe Travis::Notifications::Pusher do
  before do
    Travis.config.notifications = [:pusher]
    Travis::Notifications::Pusher.send(:public, :queue_for, :data_for)
  end

  after do
    Travis::Notifications::Pusher.send(:protected, :queue_for, :data_for)
  end

  let(:receiver) { Travis::Notifications::Pusher.new }
  let(:task)     { Factory(:request).task }
  let(:build)    { Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] }) }

# [:create]
# [:start, {:started_at=>"2011-08-10 15:52:34 +0200"}]
# [:finish, {:config=>{:rvm=>["1.8.7", "1.9.2"]}}]
# [:create]
# [:create]
# [:start, {:started_at=>"2011-08-10 15:52:34 +0200"}]
# [:start, {:started_at=>"2011-08-10 15:52:34 +0200"}]
# [:log, {:log=>"foo"}]
# [:finish, {:finished_at=>"2011-08-10 15:52:34 +0200", :status=>"0"}]
# [:start, {:started_at=>"2011-08-10 15:52:34 +0200"}]
# [:start, {:started_at=>"2011-08-10 15:52:34 +0200"}]
# [:log, {:log=>"foo"}]
# [:finish, {:finished_at=>"2011-08-10 15:52:34 +0200", :status=>"0"}]
# [:finish, {:finished_at=>"2011-08-10 15:52:34 +0200", :status=>"0"}]

  describe 'sends a message to pusher' do
    it 'build:queued' do
      Travis::Notifications.dispatch('build:queued', build)
      pusher.should have_message('build:queued', build)
    end

    it 'build:removed' do
      Travis::Notifications.dispatch('build:removed', build)
      pusher.should have_message('build:removed', build)
    end

    it 'build:started' do
      Travis::Notifications.dispatch('build:started', build)
      pusher.should have_message('build:started', build)
    end

    it 'build:log' do
      Travis::Notifications.dispatch('build:log', build)
      pusher.should have_message('build:log', build)
    end

    it 'build:finished' do
      Travis::Notifications.dispatch('build:finished', build)
      pusher.should have_message('build:finished', build)
    end
  end

  describe 'data_for returns the payload required for client side task events' do
    it 'build:queued' do
      receiver.data_for('build:queued', task) == [:build, :repository]
    end

    it 'build:removed' do
      receiver.data_for('build:removed', build) == [:build, :repository]
    end

    it 'build:started' do
      receiver.data_for('build:started', build) == [:build, :repository]
    end

    it 'build:log' do
      receiver.data_for('build:log', build, :log => 'foo') == [:build, :repository, :log]
    end

    it 'build:finished' do
      receiver.data_for('build:finished', build).keys.should == [:build, :repository]
    end
  end

  describe 'queue_for' do
    it 'returns "jobs" for task events' do
      receiver.queue_for('task:configure:created').should == 'jobs'
    end

    it 'returns "jobs" for build events' do
      receiver.queue_for('build:started').should == 'repositories'
    end
  end
end

