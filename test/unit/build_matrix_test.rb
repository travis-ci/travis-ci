require 'test_helper'

class BuildTest < ActiveSupport::TestCase
  Build.send(:public, :expand_matrix!, :expand_matrix_config)

  attr_reader :config, :build, :expected_matrix_configs

  def setup
    super
    @config = {
      'matrix' => [
        ['rvm', '1.8.7', '1.9.2'],
        ['gemfile', 'gemfiles/Gemfile.rails-2.3.x', 'gemfiles/Gemfile.rails-3.0.x']
      ]
    }
    @expected_matrix_configs = [
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/Gemfile.rails-2.3.x']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/Gemfile.rails-3.0.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/Gemfile.rails-2.3.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/Gemfile.rails-3.0.x']]
    ]
    @build = Factory(:build, :number => 2, :commit => '12345', :config => config)
  end

  test 'yaml configuration for matrix builds' do
    assert_equal config, YAML.load(%(matrix:\n  - ["rvm", "1.8.7", "1.9.2"]\n  - ["gemfile", "gemfiles/Gemfile.rails-2.3.x", "gemfiles/Gemfile.rails-3.0.x"]))
  end

  test 'expanding the build matrix configuration' do
    assert_equal expected_matrix_configs, build.expand_matrix_config(config['matrix'])
  end

  test 'expanding a matrix build sets the config to the children' do
    assert_equal 4, build.matrix.size
    assert_equal expected_matrix_configs.map { |c| Hash[*c.flatten] }, build.matrix.map(&:config)
  end

  test 'expanding a matrix build copies the build attributes' do
    assert_equal ['12345'] * 4, build.matrix.map(&:commit)
  end

  test 'expanding a matrix build adds a sub-build number to the build number' do
    assert_equal ['2:1', '2:2', '2:3', '2:4'], build.matrix.map(&:number)
  end

  test 'matrix_expanded? returns true if the matrix has just been expanded' do
    assert build.matrix_expanded?
  end

  test 'matrix_expanded? returns false if there is no matrix' do
    assert !Factory(:build).matrix_expanded?
  end

  test 'matrix_expanded? returns false if the matrix existed before' do
    build.save!
    assert !build.matrix_expanded?
  end

  test 'matrix build as_json' do
    attributes = {
      'committed_at' => nil,
      'commit' => '12345',
      'author_name' => nil,
      'author_email' => nil,
      'committer_name' => nil,
      'committer_email' => nil,
      :repository => {
        'id' => build.repository.id,
        'name' => 'svenfuchs/minimal',
        'last_duration' => 60,
        'url' => 'http://github.com/svenfuchs/minimal',
      },
      'message' => nil,
      'status' => nil,
      'config' => {
        'gemfile' => 'gemfiles/Gemfile.rails-2.3.x',
        'rvm' => '1.8.7'
      }
    }
    expected = {
      'id' => build.id,
      'number' => 2,
      'commit' => '12345',
      'message' => nil,
      'status' => nil,
      'committed_at' => nil,
      'committer_name' => nil,
      'committer_email' => nil,
      'author_name' => nil,
      'author_email' => nil,
      :repository => {
        'id' => build.repository.id,
        'name' => 'svenfuchs/minimal',
        'url' => 'http://github.com/svenfuchs/minimal',
        'last_duration' => 60,
      },
      :matrix => [
        attributes.merge('id' => build.id + 1, 'number' => '2:1', 'config' => { 'gemfile' => 'gemfiles/Gemfile.rails-2.3.x', 'rvm' => '1.8.7' }),
        attributes.merge('id' => build.id + 2, 'number' => '2:2', 'config' => { 'gemfile' => 'gemfiles/Gemfile.rails-3.0.x', 'rvm' => '1.8.7' }),
        attributes.merge('id' => build.id + 3, 'number' => '2:3', 'config' => { 'gemfile' => 'gemfiles/Gemfile.rails-2.3.x', 'rvm' => '1.9.2' }),
        attributes.merge('id' => build.id + 4, 'number' => '2:4', 'config' => { 'gemfile' => 'gemfiles/Gemfile.rails-3.0.x', 'rvm' => '1.9.2' }),
      ]
    }
    assert_equal expected, build.as_json
  end
end
