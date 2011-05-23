require 'test_helper'

class ConfigTest < ActiveSupport::TestCase
  include Travis

  test 'when passed a non-existent file it should return an empty hash' do
    config = Buildable::Config.new("file:///lksjlfkjaslslkfjlkf.yml")
    assert_equal Hash.new, config
  end

  test 'when passed a valid file it should load the config correctly' do
    assert_equal 'rake ci', config['script']
  end

  test 'configure? returns false when expandable key has an Array value' do
    assert !config.configure?
  end

  test "configure? returns false when ['notifications']['recipients'] has an Array value" do
    assert !config({'notifications' => {'recipients' => ['user1@example.de', 'user2@example.de']}}).configure?
  end

  test 'configure? returns true when rvm has an Array value' do
    assert config('rvm' => ['1.8.7', '1.9.2']).configure?
  end

  test 'configure? returns true when gemfile has an Array value' do
    assert config('gemfile' => ['gemfiles/rails-2.3.x', 'gemfiles/rails-3.0.x']).configure?
  end

  test 'configure? returns true when env has an Array value' do
    assert config('env' => ['FOO=bar', 'FOO=baz']).configure?
  end
end
