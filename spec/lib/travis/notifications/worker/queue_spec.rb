require 'spec_helper'

describe Travis::Notifications::Worker::Queue do
  def queue(*args)
    Travis::Notifications::Worker::Queue.new(*args)
  end

  let(:rails)   { queue('rails', 'rails/rails', nil) }
  let(:erlang)  { queue('erlang', nil, 'erlang', nil) }
  let(:clojure) { queue('builds', nil, nil, 'clojure') }

  it "to_s returns Travis::Worker" do
    rails.to_s.should == "Travis::Worker"
  end

  it "name still returns the actual class name for custom worker classes" do
    rails.name.should == "rails"
  end

  describe 'matches?' do
    it "returns true when the given slug matches" do
      rails.matches?('rails/rails', nil, nil).should be_true
    end

    # it "returns true when the given target matches" do
    #   erlang.matches?(nil, 'erlang', nil).should be_true
    # end

    it "returns true when the given language matches" do
      clojure.matches?(nil, nil, 'clojure').should be_true
    end

    it "returns false when none of slug, target or language match" do
      erlang.matches?('foo/bar', 'worker-on-mars', 'COBOL').should be_false
    end
  end
end


