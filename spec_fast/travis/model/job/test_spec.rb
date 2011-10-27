require 'spec_helper'

class Job
  attr_accessor :state, :config, :status, :log, :started_at, :finished_at
  def owner; stub('build', :start => nil, :state => nil, :state= => nil) end
  def update_attributes(*); end
  def save!; end
end

describe Travis::Model::Job::Test do
  let(:record)  { Job.new }
  let(:job)     { Travis::Model::Job::Test.new(record) }
  let(:data)    { { :finished_at => Time.now, :status => 0 } }

  before(:each) { job.owner.stubs(:finish) }


  describe 'events' do
    describe 'starting the job' do
      before(:each) { job.owner.stubs(:start) }

      it 'sets the state to :started' do
        job.start
        job.state.should == :started
      end

      it 'propagates the event to the owner' do
        job.owner.expects(:start)
        job.start
      end
    end

    describe 'finishing the job' do
      it 'sets the state to :finished' do
        job.finish(data)
        job.state.should == :finished
      end

      it 'propagates the event to the owner' do
        job.owner.expects(:finish).with(data)
        job.finish(data)
      end
    end

    describe 'update_attributes' do
      describe 'given finishing attributes' do
        let(:data) { { :finished_at => Time.now, :status => 0 } }

        it 'extracts finishing attributes' do
          job.update_attributes(data)
        end

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
  end
end
