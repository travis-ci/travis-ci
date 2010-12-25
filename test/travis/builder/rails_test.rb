require 'test_helper'
require 'travis/builder'
require 'travis/builder/rails'

class TravisBuilderRailsTest < Test::Unit::TestCase
  class Buildable
    def build!
    end
  end

  class Builder < Travis::Builder
    include Travis::Builder::Rails
  end

  attr_reader :now, :builder, :rails

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)

    @builder = Builder.new('12345', :id => 1)
    builder.stubs(:buildable).returns(Buildable.new)
    builder.stubs(:post)
  end

  def work!
    EM.run { builder.work!; EM.stop }
  end

  test 'updates the build record on start' do
    builder.expects(:post).with(:started_at => Time.now)
    work!
  end

  test 'updates the build record on finish' do
    builder.expects(:post).with(:log => '', :finished_at => Time.now)
    work!
  end
end

