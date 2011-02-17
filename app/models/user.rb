require 'devise/api_token_authenticatable'

class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  def self.find_for_github_oauth(access_token, signed_in_resource=nil)
    data = access_token['extra']['user_hash']
    if user = User.find_by_email(data["email"])
      user
    else
      user = create!(data.slice(*%w(name login email)))
      user.tokens.create!
    end
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.github_data"] && session["devise.github_data"]["extra"]["user_hash"]
        user.email = data["email"]
        user.login = data["nickname"]
      end
    end
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end
end


