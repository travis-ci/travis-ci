require 'spec_helper'

describe Travis::Worker do
  let(:config) { { 'queues' => [ { 'slug' => 'rails/rails', 'queue' => 'rails' }, { 'target' => 'erlang', 'queue' => 'erlang' } ] } }

  before do
    Travis.stubs(:config).returns(config)
    Travis::Worker.setup_custom_queues
  end

  after do
    config['queues'].each { |queue| Travis::Worker.send(:remove_const, queue['queue'].capitalize) }
  end

  it "queues returns the queues configuration hash" do
    Travis::Worker.queues.should == config['queues']
  end

  it "setup_custom_queues creates a worker class per queue" do
    Travis::Worker.const_defined?(:Rails).should be_true
    Travis::Worker.const_defined?(:Erlang).should be_true
  end

  describe 'use_queue?' do
    it "returns false when neither slug or target match the given configuration hash" do
      build = Factory(:build)
      Travis::Worker.use_queue?(build, { 'slug' => 'bob/bob', 'target' => 'bobkell' }).should be_false
    end

    it "returns true when slug matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository, :owner_name => 'bob', :name => 'bob'))
      Travis::Worker.use_queue?(build, { 'slug' => 'bob/bob', 'target' => 'bobkell' }).should be_true
    end

    it "returns true when target matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository), :config => { :target => 'bobkell' })
      Travis::Worker.use_queue?(build, { 'slug' => 'bob/bob', 'target' => 'bobkell' }).should be_true
    end
  end

  describe 'worker_for' do
    it "chooses the default queue when neiter slug or target match" do
      build = Factory(:build)
      Travis::Worker.worker_for(build).should == Travis::Worker
    end

    it "chooses a queue based on the slug" do
      build = Factory(:build, :repository => Factory(:repository, :owner_name => 'rails', :name => 'rails'))
      Travis::Worker.worker_for(build).should == Travis::Worker::Rails
    end

    it "chooses a queue based on the target" do
      build = Factory(:build, :repository => Factory(:repository), :config => { :target => 'erlang' })
      Travis::Worker.worker_for(build).should == Travis::Worker::Erlang
    end
  end

  it "to_s returns Travis::Worker even for custom worker classes (required for Resque)" do
    Travis::Worker::Erlang.to_s.should == "Travis::Worker"
  end

  it "name still returns the actual class name for custom worker classes" do
    Travis::Worker::Erlang.name.should == "Travis::Worker::Erlang"
  end

  it "enqueue adds a job to the given queue" do
    payload = {
      'build' => { 'branch' => 'master', 'commit' => '62aae5f70ceee39123ef', 'id' => 1, 'number' => '1' },
      'repository' => { 'id' => 1, :slug => 'svenfuchs/minimal' },
      :queue => 'builds'
    }
    Resque.expects(:enqueue).with(Travis::Worker, payload)
    Travis::Worker.enqueue(Factory(:build))
  end
end

