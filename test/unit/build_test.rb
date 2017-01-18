require 'test_helper'

class BuildTest < ActiveSupport::TestCase
  attr_reader :repository

  def setup
    @repository = Factory(:repository)
  end

  test 'next_number (1)' do
    assert_equal 1, repository.builds.next_number
  end

  test 'next_number (2)' do
    3.times { |number| Factory(:build, :repository => repository, :number => number + 1) }
    assert_equal 4, repository.builds.next_number
  end

  test 'next_number (3)' do
    Factory(:build, :repository => repository, :number => '3.1')
    assert_equal 4, repository.builds.next_number
  end

  test "appends streamed build log chunks" do
    build = Factory(:build, :repository => repository)
    assert build.log.blank?

    line1 = "$ git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n"
    build.append_log!(line1)
    # we just did a straight SQL update, so reload the object
    build.reload
    assert !build.log.blank?
    assert_equal line1, build.log

    line2 = "$ git checkout -qf 662af2708525b776aac580b10cc903ba66050e06\n"
    build.append_log!(line2)
    # we just did a straight SQL update, so reload the object
    build.reload
    assert_equal line1 + line2, build.log

    line3 = "$ bundle install --pa"
    build.append_log!(line3)
    build.reload
    assert_equal line1 + line2 + line3, build.log
  end

  test "keys_for only selects ENV_KEYS" do
    Build::ENV_KEYS.each do |key|
      before = {'invalid key' => 'invalid', key => 'valid'}
      after = Build.keys_for(before)
      assert_equal [key], after
    end
  end

  test "keys_for selects symbolized ENV_KEYS" do
    Build::ENV_KEYS.each do |key|
      before = {key.to_sym => 'valid'}
      after = Build.keys_for(before)
      assert_equal [key], after
    end
  end
end