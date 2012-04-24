require 'spec_helper'
require 'travis/api'

describe Travis::Api::Json::Http::Build do
  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:data)  { Travis::Api::Json::Http::Build.new(build).data }

  before :each do
    build.request.event_type = 'push'
  end

  it 'build' do
    data.except('matrix').should == {
      'id' => build.id,
      'event_type' => 'push', # on the build api this probably should be just 'pull_request' => true or similar
      'repository_id' => repository.id,
      'number' => '2',
      'state' => 'finished',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
      'duration' => nil,
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
      'status' => 0, # still here for backwards compatibility
      'result' => 0,
      'commit' => '91d1b7b2a310131fe3f8',
      'branch' => 'master',
      'message' => 'Bump to 0.0.22',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'committed_at' => '2010-11-12T12:25:00Z',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'committer_name' => 'Sven Fuchs',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
    }
  end

  it 'matrix' do
    data['matrix'].first.should == {
      'id' => 7,
      'number' => '2.1',
      'log' => 'minimal log 2',
      'config' => { :rvm => '1.8.7', :gemfile => 'test/Gemfile.rails-2.3.x' },
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z'
    }
  end
end

