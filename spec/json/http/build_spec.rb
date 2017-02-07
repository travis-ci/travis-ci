require 'spec_helper'

describe 'HTTP API for Build' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }
  let(:task) { build.matrix.first }

  it 'json' do
    json = json_for_http(build)
    json.except('matrix').should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '2',
      'state' => 'finished',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
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
      "compare_url"=>"https://github.com/svenfuchs/minimal/compare/master...develop"
    }
    json['matrix'].first.should == build.matrix.map { |task| json_for_http(task) }.first
  end
end
