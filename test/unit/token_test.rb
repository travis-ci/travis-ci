require 'test_helper_rails'

class TokenTest < ActiveSupport::TestCase
  Token.send :public, :generate_token

  test 'generate_token: should set the token to a 20 character value' do
    assert_equal 20, Token.new.generate_token.length
  end
end
