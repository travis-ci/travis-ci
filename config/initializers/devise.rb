require 'travis'

# Hmm, do we actually use this?
require 'devise/api_token_authenticatable'

Devise.setup do |c|
  require 'devise/orm/active_record'

  c.http_authenticatable = true

  oauth2 = Travis.config.oauth2 || Hashr.new
  c.omniauth :github, oauth2.client_id, oauth2.client_secret, :scope => oauth2.scope
end
