require 'travis'
require 'devise/api_token_authenticatable'

OAUTH2_CONFIG = Travis.config['oauth2'] || {}

Devise.setup do |config|
  config.http_authenticatable = true
  config.omniauth :github, OAUTH2_CONFIG['client_id'], OAUTH2_CONFIG['client_secret'], :scope => ''
end
