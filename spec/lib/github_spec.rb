require 'spec_helper'
require 'github'

describe Github, :webmock => true do
  let(:data) { ActiveSupport::JSON.decode(GITHUB_PAYLOADS['gem-release']) }
  let(:payload) { Github::ServiceHook::Payload.new(data) }
  let(:repository) { payload.repository }
  
  it 'payload repository' do
    repository.name.should == 'gem-release'
  end

  it 'payload commits' do
    payload.commits.first.commit.should == '9854592'
  end

  it 'repository owned by a user' do
    fetched_repository = Github::Repository.new(Travis::GithubApi.repository('svenfuchs', 'gem-release'))
    fetched_repository.name.should == 'gem-release'
    fetched_repository.owner_name.should == 'svenfuchs'
    fetched_repository.owner_email.should == 'svenfuchs@artweb-design.de'
  end

  it 'repository owned by an organization' do
    fetched_repository = Github::Repository.new(Travis::GithubApi.repository('travis-ci', 'travis-ci'))
    fetched_repository.name.should == 'travis-ci'
    fetched_repository.owner_name.should == 'travis-ci'
    fetched_repository.owner_email.should == 'franck@verrot.fr,42@dmathieu.com,fritz.thielemann@gmail.com,fxposter@gmail.com,alexp@coffeenco.de,jeff@kreeftmeijer.nl,jmazzi@gmail.com,josh.kalderimis@gmail.com,michael.s.klishin@gmail.com,nathan.f77@gmail.com,nex.development@gmail.com,me@rubiii.com,sferik@gmail.com,steve@steveklabnik.com,svenfuchs@artweb-design.de,ward@equanimity.nl'
  end

  it 'repository to_hash' do
    repository.to_hash.should == {
      :name        => 'gem-release',
      :url         => 'http://github.com/svenfuchs/gem-release',
      :owner_name  => 'svenfuchs',
      :owner_email => 'svenfuchs@artweb-design.de'
    }
  end

  it 'build' do
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

