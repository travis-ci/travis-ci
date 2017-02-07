require 'spec_helper'

describe Task::Configure do
  attr_reader :request, :task

  before do
    @request = Factory(:request)
    @task = request.task
  end

  let(:now) { Time.now.tap { |now| Time.stubs(:now).returns(now) } }

  describe :start! do
    it 'start starts the task and propagates to the request' do
      task.start!
      request.reload.should be_started
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('task:configure:started', task)
      task.start!
    end
  end

  describe :finish! do
    let(:config) { { :rvm => ['1.8.7', '1.9.2'] } }

    it 'finishes the task and configures the request' do
      task.finish!(:config => config)

      request.reload.should be_finished
      request.config.should == config

      task.should be_finished
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('task:configure:started', task)
      Travis::Notifications.expects(:dispatch).with('task:configure:finished', task, :config => config)
      # Travis::Notifications.expects(:dispatch).with('request:configured', task, config) # not implemented
      Travis::Notifications.expects(:dispatch).with('task:test:created', instance_of(Task::Test)).times(2)

      task.start!
      task.finish!(:config => config)
    end
  end
end

