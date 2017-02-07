require 'spec_helper'

describe Travis::Notifications::Worker do
  before do
    Travis.config.notifications = [:worker]
    Travis.config.queues = [
      { :queue => 'rails', :slug => 'rails/rails' },
      { :queue => 'builds', :language => 'clojure' },
      { :queue => 'erlang', :target => 'erlang', :language => 'erlang' },
    ]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  let(:worker) { Travis::Notifications::Worker.new }

  it "queues returns an array of Queues for the config hash" do
    rails, clojure, erlang = Travis::Notifications::Worker.send(:queues)

    rails.name.should == 'rails'
    rails.slug.should == 'rails/rails'

    clojure.name.should == 'builds'
    clojure.language.should == 'clojure'

    erlang.name.should == 'erlang'
    erlang.target.should == 'erlang'
  end

  describe 'queue_for' do
    it "returns false when neither slug or target match the given configuration hash" do
      build = Factory(:build)
      worker.send(:queue_for, build).name.should == 'builds'
    end

    it "returns the queue when slug matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository, :owner_name => 'rails', :name => 'rails'))
      worker.send(:queue_for, build).name.should == 'rails'
    end

    it "returns the queue when target matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository), :config => { :language => 'clojure' })
      worker.send(:queue_for, build).name.should == 'builds'
    end

    # it "returns the queue when language matches the given configuration hash" do
    #   build = Factory(:build, :repository => Factory(:repository), :config => { :target => 'erlang' })
    #   worker.send(:queue_for, build).name.should == 'erlang'
    # end
  end

  describe 'enqueue' do
    it "adds a config job to the given queue" do
      request = Factory(:request)
      request.task.should be_queued('builds')
    end

    it "adds a test job to the given queue" do
      build = Factory(:build)
      build.matrix.reverse.each do |task|
        task.should be_queued('builds')
      end
    end
  end
end

