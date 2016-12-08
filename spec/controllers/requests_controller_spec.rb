require 'spec_helper'

describe RequestsController do
  describe 'POST :create' do
    let(:user)    { User.create!(:login => 'user').tap { |user| user.tokens.create! } }
    let(:auth)    { ActionController::HttpAuthentication::Basic.encode_credentials(user.login, user.tokens.first.token) }
    let(:payload) { GITHUB_PAYLOADS['gem-release'] }

    before(:each) do
      Travis.config.notifications = [:worker]
      request.env['HTTP_AUTHORIZATION'] = auth
      request.env['HTTP_X_GITHUB_EVENT'] = 'push'
    end

    describe 'given an approvable payload' do
      let(:action) { lambda { post :create, :payload => payload } }

      it 'creates a Request and stores the payload' do
        action.should change(Request, :count).by(1)
        Request.last.payload.should =~ %r(svenfuchs/gem-release)
      end

      it 'leaves the request in the state :created' do
        action.call
        Request.last.state.should == 'created'
      end

      it 'creates a repository' do
        action.should change(Repository, :count).by(1)
        Repository.last.slug.should == 'svenfuchs/gem-release'
      end

      it 'creates a commit' do
        action.should change(Commit, :count).by(1)
        Commit.last.commit.should == '46ebe012ef3c0be5542a2e2faafd48047127e4be'
      end

      it 'creates a configure job' do
        action.should change(Job::Configure, :count).by(1)
        Job::Configure.last.source.should == Request.last
      end
    end

    describe 'given an unapprovable payload' do
      let(:action) { lambda { post :create, :payload => payload.gsub('refs/heads/master', 'refs/heads/gh_pages') } }

      it 'creates a Request and stores the payload' do
        action.should change(Request, :count).by(1)
        Request.last.payload.should =~ %r(svenfuchs/gem-release)
      end

      it 'leaves the request in the state :finished' do
        action.call
        Request.last.state.should == 'finished'
      end

      it 'creates a repository' do
        action.should change(Repository, :count).by(1)
        Repository.last.slug.should == 'svenfuchs/gem-release'
      end

      it 'creates a commit' do
        action.should change(Commit, :count).by(1)
        Commit.last.commit.should == '46ebe012ef3c0be5542a2e2faafd48047127e4be'
      end

      it 'does not create a configure job' do
        action.should_not change(Job::Configure, :count)
      end
    end
  end
end
