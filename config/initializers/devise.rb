require 'travis'
require 'devise/orm/active_record'
require 'devise/omniauth_callbacks_controller'

OAUTH2_CONFIG = Travis.config['oauth2'] || {}

Devise.setup do |config|
  config.http_authenticatable = true
  config.omniauth :github, OAUTH2_CONFIG['client_id'], OAUTH2_CONFIG['client_secret'], :scope => ''
end

Devise::OmniauthCallbacksController.class_eval do
  def after_omniauth_failure_path_for(scope)
    '/'
  end
end
