require 'test_helper'

class RouteRedirectionTest < ActionDispatch::IntegrationTest
  fixtures :all

  test "the user is redirected to the hash bang version of the user route" do
    get "/svenfuchs"
    assert_redirected_to "http://www.example.com/#!/svenfuchs"
  end

  test "the user is redirected to the hash bang version of the repository route" do
    get "/svenfuchs/travis"
    assert_redirected_to "http://www.example.com/#!/svenfuchs/travis"
  end

  test "the user is redirected to the hash bang version of the repository builds route" do
    get "/svenfuchs/travis/builds"
    assert_redirected_to "http://www.example.com/#!/svenfuchs/travis/builds"
  end

  test "the user is redirected to the hash bang version of the repository build route" do
    get "/svenfuchs/travis/builds/1"
    assert_redirected_to "http://www.example.com/#!/svenfuchs/travis/builds/1"
  end

end
