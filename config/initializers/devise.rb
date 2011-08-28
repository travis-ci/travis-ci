require 'travis'
require 'devise/api_token_authenticatable'

# override this for rails admin
class CustomFailure < Devise::FailureApp
  def redirect_url
    root_url
  end
  protected :redirect_url
end

Devise.setup do |c|
  require 'devise/orm/active_record'

  c.warden do |manager|
    manager.failure_app = CustomFailure
  end

  c.http_authenticatable = true

  oauth2 = Travis.config.oauth2 || Hashr.new
  c.omniauth :github, oauth2.client_id, oauth2.client_secret, :scope => oauth2.scope
end
