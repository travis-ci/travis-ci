require 'spec_helper'
require 'support/active_record'

describe Travis::Notifications::Worker do
  include Support::ActiveRecord

  let(:worker) { Travis::Notifications::Worker.new }

  before do
    Travis.config.queues = [
      { :queue => 'rails', :slug => 'rails/rails' },
      { :queue => 'builds', :language => 'clojure' },
      { :queue => 'erlang', :target => 'erlang', :language => 'erlang' },
    ]
  end

  it 'queues returns an array of Queues for the config hash' do
    rails, clojure, erlang = Travis::Notifications::Worker.send(:queues)

    rails.name.should == 'rails'
    rails.slug.should == 'rails/rails'

    clojure.name.should == 'builds'
    clojure.language.should == 'clojure'

    erlang.name.should == 'erlang'
    erlang.target.should == 'erlang'
  end

  describe 'queue_for' do
    it 'returns false when neither slug or target match the given configuration hash' do
      build = Factory(:build)
      worker.send(:queue_for, build).name.should == 'ruby'
    end

    it 'returns the queue when slug matches the given configuration hash' do
      build = Factory(:build, :repository => Factory(:repository, :owner_name => 'rails', :name => 'rails'))
      worker.send(:queue_for, build).name.should == 'rails'
    end

    it 'returns the queue when target matches the given configuration hash' do
      build = Factory(:build, :repository => Factory(:repository), :config => { :language => 'clojure' })
      worker.send(:queue_for, build).name.should == 'builds'
    end

    # it 'returns the queue when language matches the given configuration hash' do
    #   build = Factory(:build, :repository => Factory(:repository), :config => { :target => 'erlang' })
    #   worker.send(:queue_for, build).name.should == 'erlang'
    # end
  end

  describe 'notify' do
    let(:job)     { Factory(:request).job }
    let(:payload) { 'the-payload' }

    before :each do
      Travis::Notifications::Worker.stubs(:payload_for).returns(payload)
      Travis::Amqp.stubs(:publish)
    end

    it 'generates a payload for the given job' do
      Travis::Notifications::Worker.stubs(:payload_for).with(job, :queue => 'ruby')
      worker.notify(:start, job)
    end

    it 'adds the payload to the given queue' do
      Travis::Amqp.expects(:publish).with('ruby', payload)
      worker.notify(:start, job)
    end
  end
end
