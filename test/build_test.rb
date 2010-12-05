require 'test_helper'

class BuildText < Test::Unit::TestCase
  test 'foo' do
    build = Factory(:build)
    expected   = { 'build' => { 'id' => build.id, 'number' => nil, 'commit' => '62aae5f70ceee39123ef', :repository =>
      { 'id' => build.repository.id, 'name' => 'svenfuchs/i18n', 'uri' => 'http://github.com/svenfuchs/i18n' } } }
    assert_equal expected, build.as_json
  end
end
