require 'travis'
require 'devise/oauth_failure'

OAUTH2_CONFIG = Travis.config['oauth2'] || {}

Devise.setup do |config|
  require 'devise/orm/active_record'

  config.http_authenticatable = true

  config.omniauth :github, OAUTH2_CONFIG['client_id'], OAUTH2_CONFIG['client_secret'], :scope => ''
end

