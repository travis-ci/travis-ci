require 'spec_helper'
require 'support/active_record'

describe Job::Requeueing do
  include Support::ActiveRecord

  let(:job) { Factory(:test) }

  describe 'scopes' do
    let! :jobs do
      [ Factory(:test, :state => :created,  :created_at => Time.now - Travis.config.jobs.retry.after - 60),
        Factory(:test, :state => :started,  :created_at => Time.now - Travis.config.jobs.retry.after - 120),
        Factory(:test, :state => :finished, :created_at => Time.now - Travis.config.jobs.retry.after + 10) ]
    end

    describe :unfinished do
      it 'finds unfinished jobs' do
        Job.unfinished.should == jobs[0, 2]
      end
    end

    describe :stalled do
      it 'finds stalled jobs' do
        Job.stalled.should == jobs[0, 2]
      end
    end
  end

  describe :enqueue do
    before :each do
      Travis::Notifications::Worker.stubs(:enqueue)
    end

    it 'enqueues the job' do
      Travis::Notifications::Worker.expects(:enqueue).with(job)
      job.enqueue
    end

    it 'increments the retries count' do
      lambda { job.enqueue }.should change(job, :retries).by(1)
    end
  end

  describe :force_finish do
    # TODO @flippingbits, could you look into this?
    xit 'appends a message to the log' do
      job.force_finish
      job.reload.log.content.should == "some log.\n#{Job::Requeueing::FORCE_FINISH_MESSAGE}"
    end

    it 'finishes the job' do
      job.force_finish
      job.finished?.should be_true
    end
  end
end


