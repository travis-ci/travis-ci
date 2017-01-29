require 'spec_helper'

describe 'JSON for webhooks' do

  let(:repository) { Scenario.default.first }
  let(:build) { repository.last_build }

  it 'build:finished' do
    json_for_webhook(build).except('matrix').should == {
      'repository' => {
        'id' => repository.id,
        'name' => 'minimal',
        'owner_name' => 'svenfuchs',
        'url' => 'http://github.com/svenfuchs/minimal'
      },
      'id' => build.id,
      'number' => '2',
      'status' => 0,
      'status_message' => 'Fixed',
      'started_at' => '2010-11-12T12:30:00Z',
      'finished_at' => '2010-11-12T12:30:20Z',
      'commit' => '91d1b7b2a310131fe3f8',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'Bump to 0.0.22',
      'committed_at' => '2010-11-12T12:25:00Z',
      'committer_name' => 'Sven Fuchs',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
    }
  end
end

