require 'spec_helper'

class RequestMock
  attr_accessor :state
  def save!; end
  def update_attributes!(*); end
  def create_build!; end
  def commit; @commit ||= stub('commit', :branch => 'master') end
end

describe Travis::Model::Request do
  let(:payload) { GITHUB_PAYLOADS['gem-release'] }
  let(:record)  { RequestMock.new }
  let(:request) { Travis::Model::Request.new(record) }
  let(:build)   { stub('build', :matrix => [stub('job', :state= => nil)]) }

  before :each do
    ::Request.stubs(:create_from).returns(record)
  end

  describe :create_build do
    it 'creates the build record' do
      record.expects(:create_build!).returns(build)
      request.create_build
    end

    it 'notifies about a created event for each test job in the build matrix' do
      record.stubs(:create_build!).returns(build)
      Travis::Notifications.expects(:dispatch).with('job:test:created', anything).once
      request.create_build
    end
  end

  describe '.create' do
    it 'creates a Request record' do
      ::Request.expects(:create_from).returns(record)
      Travis::Model::Request.create(payload, 'token')
    end

    it 'instantiates a new Request with the record' do
      Travis::Model::Request.create(payload, 'token').record.should == record
    end

    it 'sets the state :created to the record' do
      record.expects(:state=).with(:created)
      Travis::Model::Request.create(payload, 'token')
    end
  end

  describe 'events' do
    it 'has the state :created when just created' do
      request.state.should == :created
    end

    describe 'start!' do
      it 'changes the state to :started' do
        request.start!
        request.state.should == :started
      end

      it 'saves the record' do
        record.expects(:save!).times(2) # TODO why exactly do we save the record twice?
        request.start!
      end
    end

    describe 'configure!' do
      let(:data) { { :rvm => 'rbx' } }

      describe 'with an approved request' do
        before :each do
          request.stubs(:approved?).returns(true)
        end

        it 'changes the state to :finished (because it also finishes the request)' do
          request.configure!(data)
          request.state.should == :finished
        end

        it 'saves the record' do
          record.expects(:save!).times(2)
          request.configure!(data)
        end

        it 'creates the build' do
          request.expects(:create_build)
          request.configure!(data)
        end
      end

      describe 'with an unapproved request' do
        before :each do
          request.stubs(:approved?).returns(false)
        end

        it 'changes the state to :finished (because it also finishes the request)' do
          request.configure!(data)
          request.state.should == :finished
        end

        it 'saves the record' do
          record.expects(:save!).times(2)
          request.configure!(data)
        end

        it 'does not create a build' do
          request.expects(:create_build).never
          request.configure!(data)
        end
      end
    end

    describe 'finish!' do
      it 'changes the state to :finish' do
        request.finish!
        request.state.should == :finished
      end

      it 'saves the record' do
        record.expects(:save!).times(2)
        request.finish!
      end
    end
  end

  describe :approved? do
    describe 'returns true' do
      it 'if there is no branches option' do
        request.record.stubs(:config).returns({})
        request.should be_approved
      end

      it 'if the branch is included the branches option given as a string' do
        request.record.stubs(:config).returns(:branches => 'master, develop')
        request.should be_approved
      end

      it 'if the branch is included in the branches option given as an array' do
        request.record.stubs(:config).returns(:branches => ['master', 'develop'])
        request.should be_approved
      end

      it 'if the branch is included in the branches :only option given as a string' do
        request.record.stubs(:config).returns(:branches => { :only => 'master, develop' })
        request.should be_approved
      end

      it 'if the branch is included in the branches :only option given as an array' do
        request.record.stubs(:config).returns(:branches => { :only => ['master', 'develop'] })
        request.should be_approved
      end

      it 'if the branch is not included in the branches :except option given as a string' do
        request.record.stubs(:config).returns(:branches => { :except => 'github-pages, feature-*' })
        request.should be_approved
      end

      it 'if the branch is not included in the branches :except option given as an array' do
        request.record.stubs(:config).returns(:branches => { :except => ['github-pages', 'feature-*'] })
        request.should be_approved
      end
    end

    describe 'returns false' do
      before(:each) { request.record.commit.stubs(:branch).returns('staging') }

      it 'if the branch is not included the branches option given as a string' do
        request.record.stubs(:config).returns(:branches => 'master, develop')
        request.should_not be_approved
      end

      it 'if the branch is not included in the branches option given as an array' do
        request.record.stubs(:config).returns(:branches => ['master', 'develop'])
        request.should_not be_approved
      end

      it 'if the branch is not included in the branches :only option given as a string' do
        request.record.stubs(:config).returns(:branches => { :only => 'master, develop' })
        request.should_not be_approved
      end

      it 'if the branch is not included in the branches :only option given as an array' do
        request.record.stubs(:config).returns(:branches => { :only => ['master', 'develop'] })
        request.should_not be_approved
      end

      it 'if the branch is included in the branches :except option given as a string' do
        request.record.stubs(:config).returns(:branches => { :except => 'staging, feature-*' })
        request.should_not be_approved
      end

      it 'if the branch is included in the branches :except option given as an array' do
        request.record.stubs(:config).returns(:branches => { :except => ['staging', 'feature-*'] })
        request.should_not be_approved
      end
    end
  end
end
