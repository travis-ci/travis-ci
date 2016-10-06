require 'test_helper'
require 'travis/builder'
require 'travis/builder/stdout'

STDOUT.sync = true

class TravisBuilderStdoutTest < ActiveSupport::TestCase
  class Mocks::StdoutBuildable < Mocks::Buildable
    def run!
      system('echo "some build output"')
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

    @builder = Builder.new('12345', RESQUE_PAYLOADS['gem-release'])
    builder.stubs(:buildable).returns(Mocks::StdoutBuildable.new)
  end

  def work!
    EM.run { EM.defer { builder.work!; EM.stop } }
  end

  test 'pipes the build output to on_log' do
    builder.expects(:on_log).with("some build output\n")
    work!
  end

  test 'buffer' do
    buffer = Travis::Builder::Stdout::Buffer.new
    assert buffer.empty?, 'buffer should be empty'

    buffer << 'foo'
    assert !buffer.empty?, 'buffer should not be empty'

    assert_equal 'foo', buffer.read
    assert buffer.empty?, 'buffer should be empty'
  end
end
