module Support
  module OmniauthHelperMethods
    def mock_omniauth
      OmniAuth.config.test_mode = true
      OmniAuth.config.mock_auth[:github] = {
        'provider' => 'github',
        'uid' => '12345',
        'credentials' => {
          'token' => 'access_token',
          'secret' => 'secret'
        },
        'user_info' => {
          'name'  => 'name',
          'email' => 'email@gmail.com',
          'nickname' => 'nickname',
          'uid' => 'uid',
        }
      }
    end
  end
end
