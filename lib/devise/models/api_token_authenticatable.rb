module Devise
  module Models
    module ApiTokenAuthenticatable
      extend ActiveSupport::Concern

      module ClassMethods
        def find_for_api_token_authentication(conditions)
          where(:login => conditions[:login]).joins(:tokens).where(Token.arel_table[:token].eq(conditions[:token])).first
        end

        ::Devise::Models.config(self, :api_token_authentication_keys)
      end
    end
  end
end
