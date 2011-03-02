require 'test_helper'

class BuildTest < ActiveSupport::TestCase
  attr_reader :config, :build, :expected_matrix_configs

  def setup
    super
    @build = Build.create!(:number => 2, :commit => '12345')
    @config = [
      ['rvm', '1.8.7', '1.9.2'],
      ['gemfile', 'gemfiles/Gemfile.test.rails-2.3.x', 'gemfiles/Gemfile.test.rails-3.0.x']
    ]
    @expected_matrix_configs = [
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/Gemfile.test.rails-2.3.x']],
      [['rvm', '1.8.7'], ['gemfile', 'gemfiles/Gemfile.test.rails-3.0.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/Gemfile.test.rails-2.3.x']],
      [['rvm', '1.9.2'], ['gemfile', 'gemfiles/Gemfile.test.rails-3.0.x']]
    ]
    build.expand!(config)
  end

  test 'expanding the build matrix configuration' do
    assert_equal expected_matrix_configs, build.send(:expand_matrix, config)
  end

  test 'expanding a matrix build copies the config to the children' do
    assert_equal 4, build.children.size
    assert_equal expected_matrix_configs, build.children.map(&:config)
  end

  test 'expanding a matrix build copies the build attributes' do
    assert_equal ['12345'] * 4, build.children.map(&:commit)
  end

  test 'expanding a matrix build adds a sub-build number to the build number' do
    assert_equal ['2:1', '2:2', '2:3', '2:4'], build.children.map(&:number)
  end
end
