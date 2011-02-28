require 'test_helper'

class ConfigTest < ActiveSupport::TestCase
  include Travis

  test 'when passed a non-existent file it should return an empty hash' do
    config = Buildable::Config.new("file:///lksjlfkjaslslkfjlkf.yml")
    assert_equal Hash.new, config
  end

  test 'when passed a valid file it should load the config correctly' do
    file = Tempfile.new("travis.yml")
    file.write "script: testing"
    file.flush

    config = Buildable::Config.new(file.path)
    assert_equal 'testing', config[:script]
  end
end
