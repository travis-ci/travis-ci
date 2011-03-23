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

    @builder = Builder.new('12345', 'build' => { 'id' => 1 }, 'repository' => { 'id' => 1 })
    builder.stubs(:buildable).returns(Mocks::Buildable.new)
  end

  def work!
    EM.run { builder.work!; EM.stop }
  end

  test 'updates the build record on start and on finish' do
    builder.expects(:post).with('msg_id' => 1, 'started_at' => Time.now)
    builder.expects(:post).with('msg_id' => 2, 'status' => nil, 'finished_at' => Time.now) # 'log' => '',
    work!
  end
end
