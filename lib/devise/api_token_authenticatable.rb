require 'devise/models/api_token_authenticatable'
require 'devise/strategies/api_token_authenticatable'

module Devise
  add_module(:api_token_authenticatable, :strategy => true) # TODO somehow configure warden failure app to not use new_session_path

  mattr_accessor :api_token_authentication_keys
  self.api_token_authentication_keys = [:login, :token]
end
