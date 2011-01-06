require 'test_helper'
require 'travis/builder'
require 'travis/builder/stdout'

STDOUT.sync = true

class TravisBuilderStdoutTest < Test::Unit::TestCase
  class StdoutBuildableMock < BuildableMock
    def build!
      system('echo "build output"')
    end
  end

  class Builder < Travis::Builder
    include Travis::Builder::Stdout
  end

  attr_reader :now, :build, :builder

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)
    @build   = RESQUE_PAYLOADS['gem-release']
    @builder = Builder.new(build['job_id'], build)
    builder.stubs(:buildable).returns(StdoutBuildableMock.new)
    EM::Stdout.output = false
  end

  def work!
    EM.run { builder.work!; EM.stop }
  end

  test 'pipes the build output to on_log' do
    builder.expects(:on_log).with("build output\n")
    work!
  end
end



