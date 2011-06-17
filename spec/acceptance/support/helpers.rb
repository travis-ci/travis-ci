module HelperMethods
  def should_see_text text
    wait_until do
      find :xpath, "//*[contains(text(), '#{text}')]"
    end
  end

  def dispatch_pusher_command channel, command, params
    page.evaluate_script("trigger('#{channel}', '#{command}', '#{params.to_json}' )")
  end

end

module OmniauthHelperMethods
  def mock_omniauth
    OmniAuth.config.test_mode = true
    OmniAuth.config.mock_auth[:github] = {
      "provider" => "github",
      "uid" => "12345",
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

RSpec.configuration.include HelperMethods, :type => :acceptance
RSpec.configuration.include OmniauthHelperMethods, :type => :acceptance
