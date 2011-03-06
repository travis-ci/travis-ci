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
    builder.stubs(:buildable).returns(Mocks::Buildable.new)
  end

  def work!
    EM.run { builder.work!; EM.stop }
  end

  test 'updates the build record on start and on finish' do
    pusher.expects(:trigger).with('build:started', 'build' => build.merge('started_at' => Time.now)).returns(Mocks::Connection.new)
    pusher.expects(:trigger).with('build:finished', 'build' => build.merge('finished_at' => Time.now)).returns(Mocks::Connection.new)
    work!
  end
end
