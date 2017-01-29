require 'spec_helper'

describe Build do
  let(:repository) { Factory(:repository) }

  describe 'ClassMethods' do
    it 'recent returns recent builds that at least are started ordered by creation time descending' do
      Factory(:build, :state => 'finished')
      Factory(:build, :state => 'started')
      Factory(:build, :state => 'created')

      Build.recent.all.map(&:state).should == ['started', 'finished']
    end

    it 'was_started returns builds that are either started or finished' do
      Factory(:build, :state => 'finished')
      Factory(:build, :state => 'started')
      Factory(:build, :state => 'created')

      Build.was_started.map(&:state).sort.should == ['finished', 'started']
    end

    it 'on_branch returns builds that are on any of the given branches' do
      Factory(:build, :commit => Factory(:commit, :branch => 'master'))
      Factory(:build, :commit => Factory(:commit, :branch => 'develop'))
      Factory(:build, :commit => Factory(:commit, :branch => 'feature'))

      Build.on_branch('master,develop').map(&:commit).map(&:branch).sort.should == ['develop', 'master']
    end

    it 'next_number returns the next build number' do
      1.upto(3) do |number|
        Factory(:build, :repository => repository, :number => number)
        repository.builds.next_number.should == number + 1
      end
    end
  end

  describe 'InstanceMethods' do
    describe 'config' do
      it 'defaults to an empty hash' do
        Build.new.config.should == {}
      end

      it 'deep_symbolizes keys on write' do
        build = Factory(:build, :config => { 'foo' => { 'bar' => 'bar' } })
        build.config[:foo][:bar].should == 'bar'
      end
    end

    it 'sets its number to the next build number on creation' do
      1.upto(3) do |number|
        Factory(:build).reload.number.should == number.to_s
      end
    end

    describe :finish do
      let(:build) { Factory(:build) }

      it 'sets the given status to the matrix_status if the matrix is finished' do
        build.stubs(:matrix_finished?).returns(true)
        build.stubs(:matrix_status).returns(1)
        build.finish(:status => 0)
        build.status.should == 1
      end

      it 'does not set the given status to the build if the matrix is not finished' do
        build.finish(:status => 0)
        build.status.should be_nil
      end
    end

    describe :pending? do
      it 'returns true if the build is finished' do
        build = Factory(:build, :state => :finished)
        build.pending?.should be_false
      end

      it 'returns true if the build is not finished' do
        build = Factory(:build, :state => :started)
        build.pending?.should be_true
      end
    end

    describe :passed? do
      it 'passed? returns true if status is 0' do
        build = Factory(:build, :status => 0)
        build.passed?.should be_true
      end

      it 'passed? returns true if status is 1' do
        build = Factory(:build, :status => 1)
        build.passed?.should be_false
      end
    end

    describe :status_message do
      it 'returns "Passed" if the build has passed' do
        build = Factory(:build, :status => 0, :state => :finished)
        build.status_message.should == 'Passed'
      end

      it 'returns "Failed" if the build has failed' do
        build = Factory(:build, :status => 1, :state => :finished)
        build.status_message.should == 'Failed'
      end

      it 'returns "Pending" if the build is pending' do
        build = Factory(:build, :status => nil, :state => :started)
        build.status_message.should == 'Pending'
      end
    end

    describe :color do
      it 'returns "green" if the build has passed' do
        build = Factory(:build, :status => 0, :state => :finished)
        build.color.should == 'green'
      end

      it 'returns "red" if the build has failed' do
        build = Factory(:build, :status => 1, :state => :finished)
        build.color.should == 'red'
      end

      it 'returns "yellow" if the build is pending' do
        build = Factory(:build, :status => nil, :state => :started)
        build.color.should == 'yellow'
      end
    end

    it "finds the previous finished build on the same repository and branch" do
      repo   = Factory(:repository, :name => "test")
      commit = Factory(:commit, :branch => "test")

      Factory(:successful_build, :repository => repo, :commit => commit)
      Factory(:successful_build, :repository => repo, :commit => commit)
      Factory(:broken_build,     :repository => repo, :commit => commit)
      Factory(:successful_build, :repository => repo)
      build = Factory(:successful_build, :repository => repo, :commit => commit)
      previous = build.previous_finished_on_branch
      previous.number.should == "3"
      previous.passed?.should == false
      build.status_message.should == "Fixed"
    end
  end
end

