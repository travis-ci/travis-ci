require 'spec_helper'

class TestMock
  include Module.new {
    def append_log!(*); end
    def update_attributes(*); end
  }

  class << self
    def name; 'Job::Test'; end
    def after_create; end
  end

  include Job::Test::States

  attr_accessor :state, :config, :status, :log, :started_at, :finished_at
  def owner; @owner ||= stub('build', :start => nil, :finish => nil, :state => nil, :state= => nil) end
  def save!; end
  def denormalize(*); end
  def add_tags(*); end # TODO simple_states needs to be able to take multiple declarations for the same event
end

describe Job::Test::States do
  let(:job) { TestMock.new }

  describe 'events' do
    describe 'starting the job' do
      let(:data) { WORKER_PAYLOADS['job:test:started'] }

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

        it 'updates the job with the given attributes' do
          job.expects(:update_attributes).with(data)
          job.update_attributes(data)
        end

        it 'starts the job' do
          job.expects(:start).with(:started_at => data['started_at'])
          job.update_attributes(data)
        end
      end

      describe 'given finishing attributes' do
        let(:data) { WORKER_PAYLOADS['job:test:finished'] }

        it 'updates the job with the given attributes' do
          job.expects(:update_attributes).with(data)
          job.update_attributes(data)
        end

        it 'finishes the job' do
          job.update_attributes(data)
          job.state.should == :finished
        end
      end
    end

    describe :append_log! do
      it 'appends the given chars to the log' do
        job.expects(:append_log!).with('chars')
        job.append_log!('chars')
      end

      it 'notifies observers' do
        Travis::Notifications.expects(:dispatch).with('job:test:log', job, :build => { :_log => 'chars' })
        job.append_log!('chars')
      end
    end
  end
end
