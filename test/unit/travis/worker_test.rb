require 'test_helper'

class TravisWorkerTest < ActiveSupport::TestCase
  def remove_custom_workers
    @queues_hash['queues'].each do |queue_details|
      name = queue_details['queue'].capitalize
      Travis::Worker.send(:remove_const, name)
    end
  end

  setup do
    @repository = Factory(:repository)
    @build      = Factory(:build, :repository => @repository)

    @queues_hash = {
      'queues' => [
        { 'slug' => 'rails/rails', 'queue' => 'rails' },
        { 'target' => 'erlang', 'queue' => 'erlang' }
      ]
    }

    Travis.stubs(:config).returns(@queues_hash)

    Travis::Worker.setup_custom_queues
  end

  test "#queues : the queues hash is returned" do
    assert_equal @queues_hash['queues'], Travis::Worker.queues
  end

  test "#setup_custom_queues : creates a rails and erlang worker class" do
    remove_custom_workers

    Travis::Worker.setup_custom_queues

    assert Travis::Worker.const_defined?('Rails')
    assert Travis::Worker.const_defined?('Erlang')
  end

  test "#use_queue? : returns false when neither slug or target match" do
    assert !Travis::Worker.use_queue?(@build, { 'slug' => 'bob/bob', 'target' => 'bobkell' })
  end

  test "#use_queue? : returns true when slug matches" do
    @repository.owner_name = @repository.name = 'bob'

    assert Travis::Worker.use_queue?(@build, { 'slug' => 'bob/bob', 'target' => 'bobkell' })
  end

  test "#use_queue? : returns true when target matches" do
    @build.config ||= {}
    @build.config['target'] = 'bobkell'

    assert Travis::Worker.use_queue?(@build, { 'slug' => 'bob/bob', 'target' => 'bobkell' })
  end

  test "#worker_for : the default build queue is choosen" do
    assert_equal Travis::Worker, Travis::Worker.worker_for(@build)
  end

  test "#worker_for : the rails build queue is choosen" do
    @repository.owner_name = @repository.name = 'rails'

    assert_equal Travis::Worker::Rails, Travis::Worker.worker_for(@build)
  end

  test "#worker_for : the erlang build queue is choosen" do
    @build.config ||= {}
    @build.config['target'] = 'erlang'

    assert_equal Travis::Worker::Erlang, Travis::Worker.worker_for(@build)
  end

  test "#to_s : custom workers return Travis::Worker" do
    assert_equal "Travis::Worker", Travis::Worker::Erlang.to_s
  end

  test "#name : custom workers return the correct name" do
    assert_equal "Travis::Worker::Erlang", Travis::Worker::Erlang.name
  end

  test "#enqueue : job is queued on the standard build queue" do
    job_hash = {
      'build' => { 'branch' => 'master', 'commit' => '62aae5f70ceee39123ef', 'id' => 1, 'number' => '1' },
      'repository' => { 'id' => 1, :slug => 'svenfuchs/minimal' },
      :queue => 'builds'
    }
    Resque.stubs(:enqueue).with(Travis::Worker, job_hash)
    Travis::Worker.enqueue(@build)
  end
end
