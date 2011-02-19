require 'test_helper'
require 'travis/builder'
require 'travis/builder/pusher'
require 'eventmachine'
require 'pusher'

class TravisBuilderPusherTest < ActiveSupport::TestCase
  class Builder < Travis::Builder
    include Travis::Builder::Pusher
  end

  attr_reader :now, :build, :builder, :pusher, :channel

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)

    @build   = RESQUE_PAYLOADS['gem-release']
    @builder = Builder.new(build['job_id'], build)
    @pusher  = Object.new

    builder.stubs(:pusher).returns(pusher)
    builder.stubs(:buildable).returns(BuildableMock.new)
    pusher.stubs(:trigger).returns(ConnectionMock.new)
  end

  def work!
    EM.run { builder.work!; EM.stop }
  end

  test 'updates the build record on start' do
    pusher.expects(:trigger).with('build:started', :build => build.merge('log' => '', 'started_at' => Time.now)).returns(ConnectionMock.new)
    work!
  end

  test 'updates the build record on finish' do
    pusher.expects(:trigger).with('build:finished', :build => build.merge('log' => '', 'started_at' => Time.now, 'finished_at' => Time.now)).returns(ConnectionMock.new)
    work!
  end
end
