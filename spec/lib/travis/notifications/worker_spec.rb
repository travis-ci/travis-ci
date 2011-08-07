require 'spec_helper'

describe Travis::Notifications::Worker do
  before do
    # TODO clean this up and just set configuration
    Travis.config.notifications = [:worker]
    Travis.config.queues = [{ :queue => 'rails', :slug => 'rails/rails' }, { :queue => 'erlang', :target => 'erlang' }]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  let(:worker) { Travis::Notifications::Worker.new }

  it "queues returns an array of Queues for the config hash" do
    rails, erlang = Travis::Notifications::Worker.send(:queues)

    rails.name.should == 'rails'
    rails.slug.should == 'rails/rails'

    erlang.name.should == 'erlang'
    erlang.target.should == 'erlang'
  end

  describe 'queue_for' do
    it "returns false when neither slug or target match the given configuration hash" do
      build = Factory(:build)
      worker.send(:queue_for, build).name.should == 'builds'
    end

    it "returns true when slug matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository, :owner_name => 'rails', :name => 'rails'))
      worker.send(:queue_for, build).name.should == 'rails'
    end

    it "returns true when target matches the given configuration hash" do
      build = Factory(:build, :repository => Factory(:repository), :config => { :target => 'erlang' })
      worker.send(:queue_for, build).name.should == 'erlang'
    end
  end

  it "enqueue adds a job to the given queue" do
    build = Factory(:build)
    task  = build.matrix.first

    queue = Travis::Notifications::Worker.send(:default_queue)
    payload = {
      :build => { :id => task.id, :number => '1.1', :commit => '62aae5f70ceee39123ef', :branch => 'master', :config => {} },
      :repository => { :id => build.repository.id, :slug => 'svenfuchs/minimal' },
      :queue => 'builds'
    }

    Resque.expects(:enqueue).with(queue, payload)
    worker.notify('build:created', task)
  end
end

