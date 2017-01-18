require 'travis'
require 'devise/api_token_authenticatable'

OAUTH2_CONFIG = Travis.config['oauth2'] || {}

# override this for rails admin
class CustomFailure < Devise::FailureApp
  def redirect_url
    root_url
  end
  protected :redirect_url
end

Devise.setup do |config|
  require 'devise/orm/active_record'

  config.warden do |manager|
    manager.failure_app = CustomFailure
  end

  config.http_authenticatable = true

  config.omniauth :github, OAUTH2_CONFIG['client_id'], OAUTH2_CONFIG['client_secret'], :scope => OAUTH2_CONFIG['scope']
end
