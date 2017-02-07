require 'spec_helper'

describe ::Task::Test do
  attr_reader :build, :first, :second

  before do
    @build  = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
    @first  = build.matrix.first
    @second = build.matrix.second
  end

  let(:now) { Time.now.tap { |now| Time.stubs(:now).returns(now) } }

  describe :update_attributes do
    let(:started_payload)  { WORKER_PAYLOADS['task:test:started']  }
    let(:finished_payload) { WORKER_PAYLOADS['task:test:finished'] }

    it "starts the task" do
      first.update_attributes(started_payload['build'])
      first.should be_started
    end

    it "finishes the task" do
      first.update_attributes(finished_payload['build'])
      first.should be_finished
    end
  end

  describe :start! do
    it 'starts the task and propagates to the build' do
      first.start! :started_at => '2011-01-01 00:00:00 +0200'

      first.reload.should be_started
      first.started_at.should == DateTime.parse('2011-01-01 00:00:00 +0200')

      build.reload.should be_started
      build.started_at.should == DateTime.parse('2011-01-01 00:00:00 +0200')
    end

    it 'notifies observers' do
      # TODO this does not test any particular order of messages.
      # should use a "collector" notification receiver and test the actual order.
      Travis::Notifications.expects(:dispatch).with('task:test:started', first)
      Travis::Notifications.expects(:dispatch).with('build:started', build)
      first.start!
    end
  end

  describe :finish! do
    it 'finishes the task, sets the status and, when all of the tasks are finished, the build' do
      first.start!
      first.finish!(:status => 0, :finished_at => '2011-01-01 00:00:00 +0200')

      build.reload.should be_started
      first.reload.should be_finished
      first.finished_at.should == DateTime.parse('2011-01-01 00:00:00 +0200')
      first.status.should == 0

      second.finish!(:status => 0, :finished_at => '2011-01-01 00:01:00 +0200')

      second.reload.should be_finished
      second.finished_at.should == DateTime.parse('2011-01-01 00:01:00 +0200')
      second.status.should == 0

      build.reload.should be_finished
      build.finished_at.should == DateTime.parse('2011-01-01 00:01:00 +0200')
      build.status.should == 0
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('task:test:started', first)
      Travis::Notifications.expects(:dispatch).with('task:test:finished', first, :status => 0)
      Travis::Notifications.expects(:dispatch).with('build:started', build)

      first.start!
      first.finish!(:status => 0)
    end
  end
end
