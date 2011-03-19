require 'test_helper'
require 'resque'
require 'travis/builder'

class TravisBuilderTest < ActiveSupport::TestCase
  attr_reader :builder, :buildable

  def setup
    super
    flush_redis

    payload = RESQUE_PAYLOADS['gem-release']

    @buildable = Mocks::Buildable.new
    @builder = Travis::Builder.new(payload['job_id'], payload)
    builder.stubs(:buildable).returns(buildable)
  end

  test 'holds the build data' do
    assert_equal RESQUE_PAYLOADS['gem-release']['build'], builder.build
  end

  test 'holds the repository data' do
    assert_equal RESQUE_PAYLOADS['gem-release']['repository'], builder.repository
  end

  test 'starts a buildable' do
    buildable.expects(:run!).returns({ 'status' => 0 })
    builder.work!
  end

  # test 'publishes log output and result to redis subscribers' do
  #   meta = Travis::Builder.enqueue(:script => 'echo "1"')
  #   subscription = redis_subscribe
  #   work!

  #   assert_equal ['*', 'build:' + meta['meta_id'], "["], subscription[0]
  #   assert_equal ['*', 'build:' + meta['meta_id'], ".1\\\\\\\\n"], subscription[1]
  #   assert_equal ['*', 'build:' + meta['meta_id'], ']0'], subscription[2]
  # end

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
