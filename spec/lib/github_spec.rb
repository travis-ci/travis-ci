require 'spec_helper'
require 'github'

describe Github, :webmock => true do
  let(:data) {
    ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release'])
  }

  it 'payload repository' do
    payload = Github::ServiceHook::Payload.new(data)
    payload.repository.name.should == 'gem-release'
  end

  it 'payload commits' do
    payload = Github::ServiceHook::Payload.new(data)
    payload.commits.first.commit.should == '9854592'
  end

  it 'repository owned by a user' do
    repository = Github::Repository.new(data['repository']).fetch
    repository.name.should == 'gem-release'
    repository.owner_name.should == 'svenfuchs'
    repository.owner_email.should == 'svenfuchs@artweb-design.de'
  end

  it 'repository owned by an organization' do
    repository = Github::Repository.new(:name => 'travis-ci', :owner => 'travis-ci').fetch
    repository.name.should == 'travis-ci'
    repository.owner_name.should == 'travis-ci'
    assert_equal 'fritz.thielemann@gmail.com,hoverlover@gmail.com,jeff@kreeftmeijer.nl,josh.kalderimis@gmail.com,svenfuchs@artweb-design.de', repository.owner_email
  end

  it 'repository to_hash' do
    repository = Github::Repository.new(data['repository'])
    repository.to_hash.should == {
      :name        => 'gem-release',
      :url         => 'http://github.com/svenfuchs/gem-release',
      :owner_name  => 'svenfuchs',
      :owner_email => 'svenfuchs@artweb-design.de'
    }
  end

  it 'build' do
    repository = Github::Repository.new(data['repository'])
    commit = Github::Commit.new(data['commits'].first.merge('ref' => 'refs/heads/master', 'compare_url' => data['compare']), repository)

    commit.commit.should == '9854592'
    commit.branch.should == 'master'
    commit.message.should == 'Bump to 0.0.15'
    commit.committed_at.should == '2010-10-27 04:32:37'
    commit.committer_name.should == 'Sven Fuchs'
    commit.committer_email.should == 'svenfuchs@artweb-design.de'
    commit.author_name.should == 'Christopher Floess'
    commit.author_email.should == 'chris@flooose.de'
  end

  it 'build to_hash' do
    repository = Github::Repository.new(data['repository'])
    commit = Github::Commit.new(data['commits'].first.merge('ref' => 'refs/heads/master', 'compare_url' => data['compare']), repository)

    commit.to_hash.should == {
      :commit => '9854592',
      :branch => 'master',
      :message => 'Bump to 0.0.15',
      :committed_at => '2010-10-27 04:32:37',
      :committer_name => 'Sven Fuchs',
      :committer_email => 'svenfuchs@artweb-design.de',
      :author_name => 'Christopher Floess',
      :author_email => 'chris@flooose.de',
      :compare_url => 'https://github.com/svenfuchs/gem-release/compare/af674bd...9854592'
    }
  end
end

