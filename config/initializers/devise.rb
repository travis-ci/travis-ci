require 'travis'
require 'devise/orm/active_record'

Devise::OAUTH2_CONFIG = Travis.config['oauth2'] || {}
#Devise.oauth2_uid_field = 'login'

Devise.setup do |config|
  config.http_authenticatable = true
  config.omniauth :github, Devise::OAUTH2_CONFIG['client_id'], Devise::OAUTH2_CONFIG['client_secret']
end
