require 'test_helper'
require 'travis/builder'
require 'travis/reporter/pusher'
require 'pusher'

class TravisReporterPusherTest < Test::Unit::TestCase
  class Buildable
    def build!
    end
  end

  class Builder < Travis::Builder
    include Travis::Reporter::Pusher
  end

  attr_reader :now, :build, :builder, :pusher, :channel

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)
    @build   = RESQUE_PAYLOADS['gem-release']
    @builder = Builder.new(build['job_id'], build)
    @pusher  = Object.new
    @channel = Object.new
    builder.stubs(:pusher).returns(pusher)
    builder.stubs(:buildable).returns(Buildable.new)
    Pusher.stubs(:[]).returns(channel)
    channel.stubs(:trigger)
  end

  def expect_push(channel_id, *args)
    Pusher.expects(:[]).with(channel_id).returns(channel)
    channel.expects(:trigger).with(*args)
  end

  test 'updates the build record on start' do
    expect_push(:repository_1, 'build:started', :build => build)
    builder.work!
  end

  test 'updates the build record on finish' do
    expect_push(:repository_1, 'build:finished', :build => build.merge('started_at' => Time.now, 'finished_at' => Time.now))
    builder.work!
  end
end


