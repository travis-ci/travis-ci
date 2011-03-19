# require 'test_helper'
# require 'travis/builder'
# require 'travis/builder/pusher'
# require 'eventmachine'
# require 'pusher'
#
# class TravisBuilderPusherTest < ActiveSupport::TestCase
#   class Builder < Travis::Builder
#     include Travis::Builder::Pusher
#   end
#
#   attr_reader :now, :build, :builder, :pusher, :channel, :buildable
#
#   def setup
#     super
#     @now = Time.now
#     Time.stubs(:now).returns(now)
#
#     @build   = RESQUE_PAYLOADS['gem-release']
#     @builder = Builder.new(build['job_id'], build)
#     @pusher  = Object.new
#     @buildable = Mocks::Buildable.new
#
#     builder.stubs(:pusher).returns(pusher)
#     builder.stubs(:buildable).returns(buildable)
#     buildable.stubs(:run!).returns(1)
#   end
#
#   def work!
#     EM.run { builder.work!; EM.stop }
#   end
#
#   test 'updates the build record on start and on finish' do
#     pusher.expects(:trigger).with('build:started', 'build' => build.merge('started_at' => Time.now)).returns(Mocks::Connection.new)
#     pusher.expects(:trigger).with('build:finished', 'build' => { 'repository' => { 'id' => build['repository']['id'] }, 'id' => build['id'], 'status' => 1, 'finished_at' => Time.now }).returns(Mocks::Connection.new)
#     work!
#   end
# end
