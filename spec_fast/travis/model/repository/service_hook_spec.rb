require 'spec_helper'
require 'support/active_record'

describe Repository, 'service_hook' do
  include Support::ActiveRecord

  describe 'set' do
    let(:user)       { stub('user', :login => 'login', :github_oauth_token => 'oauth_token', :tokens => [stub(:token => 'user_token')]) }
    let(:repository) { Factory(:repository, :owner_name => 'svenfuchs', :name => 'minimal') }

    it 'given true it activates a service hook' do
      Travis.config.stubs(:domain).returns('test.travis-ci.org')
      Travis::GithubApi.expects(:add_service_hook).with('svenfuchs', 'minimal', 'oauth_token',
        :user   => 'login',
        :token  => 'user_token',
        :domain => 'test.travis-ci.org'
      )

      repository.service_hook.set(true, user)
      repository.should be_persisted
      repository.should be_active
    end

    it 'given false it removes a service hook' do
      Travis::GithubApi.expects(:remove_service_hook).with('svenfuchs', 'minimal', 'oauth_token')

      repository.service_hook.set(false, user)
      repository.should be_persisted
      repository.should_not be_active
    end
  end
end
