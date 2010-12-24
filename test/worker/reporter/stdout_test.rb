require 'test_helper'
require 'travis/builder'
require 'travis/reporter/stdout'
require 'stdout_split'

STDOUT.sync = true

class TravisReporterStdoutTest < Test::Unit::TestCase
  class Buildable
    def build!
      system('echo "build output"')
    end
  end

  class Builder < Travis::Builder
    include Travis::Reporter::Stdout
  end

  attr_reader :now, :build, :builder, :redis

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)
    @build   = RESQUE_PAYLOADS['gem-release']
    @builder = Builder.new(build['job_id'], build)
    @redis   = Object.new
    builder.stubs(:redis).returns(redis)
    builder.stubs(:buildable).returns(Buildable.new)
    StdoutSplit.output = false
  end

  def expect_push(channel_id, *args)
    redis.expects(:publish).with(channel_id, *args)
  end

  test 'pipes the build output to on_log' do
    builder.expects(:on_log).with("build output\n")
    builder.work!
  end

  # test 'updates the build record on finish' do
  #   # expect_push(:repository_1, 'build:finished', :build => build.merge('started_at' => Time.now, 'finished_at' => Time.now))
  #   builder.work!
  # end
end



