require 'spec_helper'

describe 'HTTP API for Job::Test' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:job) { build.matrix.first }

  before :each do
    Travis.config.sponsors.workers = {
      'ruby3.worker.travis-ci.org' => {
        'name' => 'Railslove',
        'url' => 'http://railslove.de'
      }
    }
  end

  it 'json' do
    json_for_http(job).should == {
      'id' => job.id,
      'repository_id' => repository.id,
      'number' => '2.1',
      'state' => 'finished',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
      'config' => { 'rvm' => '1.8.7', 'gemfile' => 'test/Gemfile.rails-2.3.x' },
      'log' => 'minimal log 2',
      'status' => 0, # still here for backwards compatibility
      'result' => 0,
      'build_id' => build.id,
      'commit' => '91d1b7b2a310131fe3f8',
      'branch' => 'master',
      'message' => 'Bump to 0.0.22',
      'committed_at' => '2010-11-12T12:25:00Z',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'worker' => 'ruby3.worker.travis-ci.org:travis-ruby-4',
      'sponsor' => { 'name' => 'Railslove', 'url' => 'http://railslove.de' }
    }
  end
end



