require 'devise/api_token_authenticatable'

class User < ActiveRecord::Base
  devise :oauth2_authenticatable, :api_token_authenticatable

  has_many :tokens

  def before_oauth2_auto_create(attributes)
    self.update_attributes!(attributes['user'].slice(*%w(name login email)))
    self.tokens.create!
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end
end


