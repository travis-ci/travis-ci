require 'spec_helper'
require 'support/active_record'

describe Travis::Consumer::Worker do
  include Support::ActiveRecord

  let(:handler) { Travis::Consumer::Worker.new(:event, Hashr.new(payload)) }
  let(:worker)  { handler.send(:worker) }
  let(:payload) { { :name => 'worker-1', :host => 'ruby-1.worker.travis-ci.org' } }

  describe 'worker' do
    describe 'if a worker with the given name and host attributes exists' do
      it 'finds the worker' do
        worker = Worker.create!(payload)
        handler.send(:worker).should == worker
      end
    end

    describe 'if no worker with the given name and host attributes exists' do
      it 'creates a new worker' do
        lambda { worker }.should change(Worker, :count).by(1)
      end

      it 'sets the name attribute' do
        worker.name.should == 'worker-1'
      end

      it 'sets the host attribute' do
        worker.host.should == 'ruby-1.worker.travis-ci.org'
      end

      it 'sets the last_seen_at attribute' do
        worker.last_seen_at.should == Time.now
      end
    end
  end

  describe 'handle' do
    it 'pings the worker on worker:ping' do
      worker.expects(:ping!)
      handler.event = :'worker:ping'
      handler.handle
    end

    it 'sets the worker state on worker:started' do
      worker.expects(:set_state).with('started')
      handler.event = :'worker:started'
      handler.handle
    end
  end
end


