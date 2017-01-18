require 'devise/strategies/token_authenticatable'

module Devise
  module Strategies
    class ApiTokenAuthenticatable < TokenAuthenticatable
      def store?
        false
      end

      def authenticate!
        resource = mapping.to.find_for_api_token_authentication(authentication_hash)

        if validate(resource)
          resource.after_api_token_authentication if resource.respond_to?(:after_api_token_authentication)
          success!(resource)
        else
          fail(:invalid_token)
        end
      end

      private
        def valid_request?
          request.post?
        end

        def remember_me?
          false
        end

        def params_auth_hash
          # params[scope] || params
          {}
        end

        def http_auth_hash
          Hash[*authentication_keys.zip(decode_credentials).flatten]
        end

        def authentication_keys
          @authentication_keys ||= mapping.to.api_token_authentication_keys
        end
    end
  end
end

Warden::Strategies.add(:api_token_authenticatable, Devise::Strategies::ApiTokenAuthenticatable)
