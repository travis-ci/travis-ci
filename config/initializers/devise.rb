require 'travis'
require "omniauth-github"

Devise.setup do |config|
  require 'devise/orm/active_record'

  config.http_authenticatable = true

  # set these or get a warning
  config.reset_password_within = 0
  config.case_insensitive_keys = []
  config.use_salt_as_remember_token = true

  oauth2 = Travis.config.oauth2 || Hashr.new
  config.omniauth :github, oauth2.client_id, oauth2.client_secret, :scope => oauth2.scope
end
