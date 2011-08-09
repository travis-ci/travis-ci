require 'spec_helper'

describe ::Task::Test do
  attr_reader :build, :first, :second

  before do
    @build  = Factory(:build, :config => { :rvm => ['1.8.7', '1.9.2'] })
    @first  = build.matrix.first
    @second = build.matrix.second
  end

  let(:now) { Time.now.tap { |now| Time.stubs(:now).returns(now) } }

  describe 'start' do
    it 'starts the task and propagates to the build' do
      first.start!
      first.reload.should be_started
      build.reload.should be_started
    end

    it 'notifies observers' do
      # TODO this does not test any particular order of messages.
      # should use a "collector" notification receiver and test the actual order.
      Travis::Notifications.expects(:dispatch).with('task:test:started', first)
      Travis::Notifications.expects(:dispatch).with('build:started', build)
      first.start!
    end
  end

  describe 'finish' do
    it 'finishes the task, sets the status and, when all of the tasks are finished, the build' do
      first.start!
      first.finish!(:status => 0)

      build.reload.should be_started
      first.reload.should be_finished
      first.status.should == 0

      second.finish!(:status => 0)

      build.reload.should be_finished
      build.status.should == 0
      second.reload.should be_finished
      second.status.should == 0
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
