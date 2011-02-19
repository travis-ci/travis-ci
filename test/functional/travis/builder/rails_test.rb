require 'test_helper'
require 'travis/builder'
require 'travis/builder/rails'

class TravisBuilderRailsTest < ActiveSupport::TestCase
  class Builder < Travis::Builder
    include Travis::Builder::Rails
  end

  attr_reader :now, :builder, :rails

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)

    @builder = Builder.new('12345', :id => 1)
    builder.stubs(:buildable).returns(BuildableMock.new)
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
    builder.expects(:post).with(:log => '', :status => nil, :finished_at => Time.now)
    work!
  end
end
