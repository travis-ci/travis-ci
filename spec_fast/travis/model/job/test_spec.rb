require 'spec_helper'

class JobMock
  attr_accessor :state, :config, :status, :log, :started_at, :finished_at
  def owner; stub('build', :start => nil, :state => nil, :state= => nil) end
  def update_attributes(*); end
  def append_log!(*); end
  def save!; end
  def denormalize(*); end
end

describe Travis::Model::Job::Test do
  let(:record)  { JobMock.new }
  let(:job)     { Travis::Model::Job::Test.new(record) }

  before(:each) do
    job.owner.stubs(:start)
    job.owner.stubs(:finish)
  end

  describe 'events' do
    describe 'starting the job' do
      let(:data) { WORKER_PAYLOADS['job:test:started'] }

      before(:each) { job.owner.stubs(:start) }

      it 'sets the state to :started' do
        job.start(data)
        job.state.should == :started
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:test:started', job, data)
        job.start(data)
      end

      it 'propagates the event to the owner' do
        job.owner.expects(:start)
        job.start(data)
      end
    end

    describe 'finishing the job' do
      let(:data) { WORKER_PAYLOADS['job:test:finished'] }

      it 'sets the state to :finished' do
        job.finish(data)
        job.state.should == :finished
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:test:finished', job, data)
        job.finish(data)
      end

      it 'propagates the event to the owner' do
        job.owner.expects(:finish).with(data)
        job.finish(data)
      end
    end

    describe :update_attributes do
      describe 'given starting attributes' do
        let(:data) { WORKER_PAYLOADS['job:test:started'] }

        it 'updates the record with the given attributes' do
          job.record.expects(:update_attributes).with(data)
          job.update_attributes(data)
        end

        it 'starts the job' do
          job.expects(:start).with(:started_at => data['started_at'])
          job.update_attributes(data)
        end
      end

      describe 'given finishing attributes' do
        let(:data) { WORKER_PAYLOADS['job:test:finished'] }

        it 'updates the record with the given attributes' do
          job.record.expects(:update_attributes).with(data)
          job.update_attributes(data)
        end

        it 'finishes the job' do
          job.update_attributes(data)
          job.state.should == :finished
        end
      end
    end

    describe :append_log! do
      it 'appends the log to the record' do
        job.record.expects(:append_log!).with('chars')
        job.append_log!('chars')
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:test:log', job, :build => { :_log => 'chars' })
        job.append_log!('chars')
      end
    end
  end
end
