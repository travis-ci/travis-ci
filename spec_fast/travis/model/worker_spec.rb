require 'spec_helper'
require 'support/active_record'

describe Worker do
  include Support::ActiveRecord

  let (:worker) { Worker.create!(:name => 'worker-1', :host => 'ruby-1.worker.travis-ci.org') }

  describe 'full_name' do
    it 'returns a name consisting of host and name' do
      worker.full_name.should == 'ruby-1.worker.travis-ci.org:worker-1'
    end
  end
end

