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
end
