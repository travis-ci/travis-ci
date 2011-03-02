require 'test_helper'

class ConfigTest < ActiveSupport::TestCase
  include Travis, BuildableTestHelper

  test 'when passed a non-existent file it should return an empty hash' do
    config = Buildable::Config.new("file:///lksjlfkjaslslkfjlkf.yml")
    assert_equal Hash.new, config
  end

  test 'when passed a valid file it should load the config correctly' do
    assert_equal 'testing', config[:script]
  end

  test 'configure? returns false when no :matrix is defined' do
    assert !config.configure?
  end

  test 'configure? returns true when a :matrix is defined' do
    assert config('matrix' => { 'rvm' => ['1.8.7', '1.9.2'] }).configure?
  end
end
