require 'spec_helper'
require 'support/active_record'

describe Job do
  include Support::ActiveRecord

  let!(:job) { Factory(:test) }

  describe :append_log! do
    it "appends chars to the log artifact" do
      line = "$ bundle install --pa"
      Artifact::Log.any_instance.expects(:append).with(line)
      job.append_log!(line)
    end

    it 'notifies observers' do
      Travis::Notifications.expects(:dispatch).with('job:test:log', job, :build => { :_log => 'chars' })
      Job::Test.append_log!(job.id, 'chars')
    end
  end
end
