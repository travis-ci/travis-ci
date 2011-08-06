require 'spec_helper'

describe Build, 'json' do
  attr_reader :repository, :build

  before do
    @repository = Scenario.default.first
    @build = repository.reload.builds.first
  end

  it 'as_json returns data for the http api' do
    to_json(build).should == {
      'id' => build.id,
      'repository_id' => repository.id,
      'number' => '1',
      'config' => { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'] },
      'state' => 'finished',
      'status' => 1,
      'started_at' => '2010-11-12T12:00:00Z',
      'finished_at' => '2010-11-12T12:00:10Z',
      'commit' => '1a738d9d6f297c105ae2',
      'branch' => 'master',
      'compare_url' => 'https://github.com/svenfuchs/minimal/compare/master...develop',
      'message' => 'add Gemfile',
      'committed_at' => '2010-11-12T11:50:00Z',
      'committer_email' => 'svenfuchs@artweb-design.de',
      'committer_name' => 'Sven Fuchs',
      'author_name' => 'Sven Fuchs',
      'author_email' => 'svenfuchs@artweb-design.de',
      'matrix' => build.matrix.map { |task|  to_json(task, :for => :build) }
    }
  end

  # it 'as_json(:for => :job) includes everything required for the resque build job (2)' do
  #   expected = { 'id' => build.id, 'number' => '1', 'commit' => '62aae5f70ceee39123ef', 'branch' => 'master' }
  #   assert_equal_hashes expected, build.as_json(:for => :job)

  #   expected = { 'id' => repository.id, :slug => 'svenfuchs/minimal' }
  #   assert_equal_hashes expected, repository.as_json(:for => :job)
  # end
end

