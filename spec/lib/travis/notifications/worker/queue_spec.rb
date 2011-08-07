require 'spec_helper'

describe Travis::Notifications::Worker::Queue do
  def queue(*args)
    Travis::Notifications::Worker::Queue.new(*args)
  end

  let(:rails)  { queue('rails', 'rails/rails') }
  let(:erlang) { queue('rails', nil, 'erlang') }

  it "to_s returns Travis::Worker" do
    rails.to_s.should == "Travis::Worker"
  end

  it "name still returns the actual class name for custom worker classes" do
    rails.name.should == "rails"
  end

  describe 'matches?' do
    it "returns true when the given slug matches" do
      rails.matches?('rails/rails', nil).should be_true
    end

    it "returns true when the given slug matches" do
      rails.matches?('rails/rails', nil).should be_true
    end

    it "returns false when the given target matches" do
      erlang.matches?('foo/bar', 'COBOL').should be_false
    end
  end
end


