class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  after_save :create_a_token

  def self.find_for_github_oauth(user_hash)
    data = user_hash['extra']['user_hash']
    if user = User.find_by_login(data["login"])
      user
    else
      create!(data.slice(*%w(name login email)))
    end
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end

  private
    def create_a_token
      self.tokens.create! if self.tokens.empty?
    end
end


