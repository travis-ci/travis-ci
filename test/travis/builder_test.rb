require 'test_helper'
require 'resque'
require 'travis/builder'
require 'travis/stream_stdout'

class TravisBuilderTest < Test::Unit::TestCase
  class TestBuildable
    def build
      system('echo 1')
    end
  end

  attr_reader :worker

  def setup
    Resque.redis.flushall

    Resque.before_first_fork = nil
    Resque.before_fork = nil
    Resque.after_fork = nil

    @worker = Resque::Worker.new(:builds)

    Travis::StreamStdout.output = false
    Travis::Buildable.stubs(:new).returns(TestBuildable.new)
  end

  test 'publishes log output and result to redis subscribers' do
    meta = Travis::Builder.enqueue(:script => 'echo "1"')
    subscription = redis_subscribe
    work!

    assert_equal ['*', 'build:' + meta['meta_id'], ".1\n"], subscription[0]
    assert_equal ['*', 'build:' + meta['meta_id'], '!0'], subscription[1]
  end

  protected

    def work!
      worker.work(0)
    end

    def redis_subscribe(pattern = '*')
      [].tap do |subscription|
        Thread.new do
          redis.psubscribe(pattern) do |on|
            on.pmessage { |*args| subscription << args }
          end
        end
      end
    end

    def redis
      @redis ||= Redis.connect
    end
end
