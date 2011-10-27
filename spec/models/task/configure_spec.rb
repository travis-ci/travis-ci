require 'spec_helper'

describe Task::Configure do
  attr_reader :request, :job

  before do
    @request = Factory(:request)
    @job = request.job
  end

  let(:now) { Time.now.tap { |now| Time.stubs(:now).returns(now) } }

  describe :start! do
    it 'start starts the job and propagates to the request' do
      job.start!
      request.reload.should be_started
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('job:configure:started', job)
      job.start!
    end
  end

  describe :finish! do
    let(:config) { { :rvm => ['1.8.7', '1.9.2'] } }

    it 'finishes the job and configures the request' do
      job.finish!(:config => config)

      request.reload.should be_finished
      request.config.should == config

      job.should be_finished
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('job:configure:started', job)
      Travis::Notifications.expects(:dispatch).with('job:configure:finished', job, :config => config)
      # Travis::Notifications.expects(:dispatch).with('request:configured', job, config) # not implemented
      Travis::Notifications.expects(:dispatch).with('job:test:created', instance_of(Task::Test)).times(2)

      job.start!
      job.finish!(:config => config)
    end
  end
end

