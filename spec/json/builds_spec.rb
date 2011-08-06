require 'spec_helper'

describe 'Rendering a build to json' do
  attr_reader :repository, :build

  before do
    @repository = Scenario.default.first
    @build = repository.reload.builds.first
  end

  def render_json(object, options = {})
    normalize_json(Travis::Renderer.json(object, options))
  end

  def normalize_json(json)
    json = json.to_json unless json.is_a?(String)
    JSON.parse(json)
  end

  it 'for the http api' do
    render_json(build).should == {
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
end
