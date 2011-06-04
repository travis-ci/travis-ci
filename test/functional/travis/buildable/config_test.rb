require 'test_helper'

class ConfigTest < ActiveSupport::TestCase
  include Travis

  test 'when passed a non-existent file it should be an empty hash' do
    assert_equal Hash.new, Buildable::Config.new("file:///does_not_exist.yml")
  end

  test 'when passed a valid but empty file it should be an empty hash' do
    File.stubs(:read).returns('')
    assert_equal Hash.new, Buildable::Config.new("file:///exists.yml")
  end

  test 'when passed a valid file it should contain the given configuration' do
    File.stubs(:read).returns("---\n  script: rake ci")
    assert_equal 'rake ci', Buildable::Config.new("file:///exists.yml")['script']
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

  test 'script returns the given script' do
    File.stubs(:read).returns("---\n  script: rake ci")
    assert_equal 'rake ci', Buildable::Config.new("file:///exists.yml").script
  end

  test "script returns 'bundle exec rake' if there's a Gemfile" do
    File.stubs(:exists?).returns(true)
    assert_equal 'bundle exec rake', Buildable::Config.new.script
  end

  test "script returns 'rake' if there's no Gemfile" do
    File.stubs(:exists?).returns(false)
    assert_equal 'rake', Buildable::Config.new.script
  end
end
