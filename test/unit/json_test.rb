require 'test_helper'

describe "Json", ActiveSupport::TestCase do
  attr_reader :now, :build, :repository

  before do
    @now = Time.now
    Time.stubs(:now).returns(now)

    @build = Factory.create(:build, :started_at => now, :committed_at => now)
    @repository = build.repository
    super
  end


end

