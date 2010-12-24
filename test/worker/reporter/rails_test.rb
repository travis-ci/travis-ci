require 'test_helper'
require 'travis/builder'
require 'travis/reporter/rails'

class TravisReporterRailsTest < Test::Unit::TestCase
  class Buildable
    def build!
    end
  end

  class Builder < Travis::Builder
    include Travis::Reporter::Rails
  end

  attr_reader :now, :builder, :rails

  def setup
    super
    @now = Time.now
    Time.stubs(:now).returns(now)

    @builder = Builder.new('12345', :id => 1)
    @rails   = Object.new
    builder.stubs(:rails).returns(rails)
    builder.stubs(:buildable).returns(Buildable.new)
    rails.stubs(:post)
  end

  test 'updates the build record on start' do
    rails.expects(:post).with(:query => { :started_at => Time.now }, :timeout => 10)
    builder.work!
  end

  test 'updates the build record on finish' do
    rails.expects(:post).with(:query => { :log => nil, :finished_at => Time.now }, :timeout => 10)
    builder.work!
  end
end

