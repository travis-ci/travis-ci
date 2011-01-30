require 'devise/api_token_authenticatable'

class User < ActiveRecord::Base
  devise :oauth2_authenticatable, :api_token_authenticatable

  has_many :tokens

  def before_oauth2_auto_create(attributes)
    self.update_attributes!(attributes['user'].slice(*%w(name login email)))
    self.tokens.create!
  end
end


