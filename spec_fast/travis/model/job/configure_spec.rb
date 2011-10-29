require 'spec_helper'

class JobMock
  attr_accessor :state, :config
  def owner; stub('request', :start => nil, :state => nil, :state= => nil) end
  def update_attributes(*); end
  def save!; end
end

describe Travis::Model::Job::Configure do
  let(:record) { JobMock.new }
  let(:job)    { Travis::Model::Job::Configure.new(record) }
  let(:config) { { :rvm => 'rbx' } }

  before :each do
    job.owner.stubs(:configure)
  end

  describe 'events' do
    describe 'starting the job' do
      it 'sets the state to :started' do
        job.start
        job.state.should == :started
      end

      it 'propagates the event to the owner' do
        job.owner.expects(:start)
        job.start
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:configure:started', job)
        job.start!
      end
    end

    describe 'finishing the job' do
      it 'sets the state to :finished' do
        job.finish(config)
        job.state.should == :finished
      end

      it 'configures the owner' do
        job.owner.expects(:configure).with(config)
        job.finish(config)
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:configure:started', job)
        Travis::Notifications.expects(:dispatch).with('job:configure:finished', job, :config => config)

        # TODO
        # Travis::Notifications.expects(:dispatch).with('request:configured', job, config) # not implemented
        # Travis::Notifications.expects(:dispatch).with('job:test:created', instance_of(Job::Test)).times(2)

        job.start!
        job.finish!(:config => config)
      end
    end

    describe 'update_attributes' do
      describe 'given finishing attributes' do
        let(:attributes) { { :config => { :rvm => 'rbx' }, :status => 0 } }

        it 'extracts finishing attributes' do
          job.update_attributes(attributes)
        end

        it 'updates the record with the given attributes' do
          job.record.expects(:update_attributes).with(attributes)
          job.update_attributes(attributes)
        end

        it 'finishes the job' do
          job.update_attributes(attributes)
          job.state.should == :finished
        end
      end
    end
  end
end
