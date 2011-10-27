require 'rubygems'
require 'test/unit'
require 'test_declarative'

class Build
  states :created, :started, :configured, :finished

  event :start,     :to => :started
  event :configure, :to => :configured, :after => :expand_matrix
  event :finish,  :to => :finished,  :if => :matrix_finished?

  attr_accessor :state, :config, :matrix, :finished_at

  def initialize
    @state = :created
    @jobs = [Job::Configure.new(:build => self)]
  end

  def start
    @started_at = Time.now
  end

  def configure(config)
    @config = config
  end

  def expand_matrix
    @matrix = [Job::Test.new(:build => self), Job::Test.new(:build => self)]
  end

  def finish
    @finished_at = Time.now
  end

  def matrix_finished?
    matrix.all? { |job| job.finished? }
  end
end

class Build::Job
  states :created, :started, :finished
  event :all, :after => :notify_build

  attr_accessor :build

  def intialize(attributes)
    self.build = attributes[:build]
  end

  def start
    @started_at = Time.now
  end

  def finish
    @finished_at = Time.now
  end

  def notify_build(event, payload)
    build.notify(event, payload)
  end
end

class Build::Job::Configure < Build::Job
end

class Build::Job::Test < Build::Job
  states :cloned, :installed
end

class BuildStatesTest < ActiveSupport::TestCase
  attr_reader :now, :build

  def setup
    @now = Time.now.tap { |now| Time.stubs(:now).returns(now) }
    @build = Build.new
    App.register_observer(build)
  end

  test "build start" do
    configure = build.jobs.first
    configure.start # comes from the worker through a message dispatcher
    assert build.started?
  end

  test "build configure" do
    config = { :foo => :bar }
    configure = build.jobs.first
    configure.finish(config) # comes from the worker through a message dispatcher

    assert configure.finished?
    assert_equal now, configure.finished_at

    assert build.configured?
    assert_equal config, build.config
    assert_equal [:foo, :bar], build.matrix
  end

  test "build finish" do
    build.state = :configured
    build.matrix.each do |job|
      job.state = :started
      job.finish(:result => 0)

      assert job.finished?
      assert_equal 0, job.result
    end

    assert build.finished?
    assert_equal now, build.finished_at
  end
end
