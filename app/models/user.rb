class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  attr_accessible :name, :login, :email, :github_id, :github_oauth_token

  after_create :create_a_token

  class << self
    def find_for_github_oauth(user_hash)
      user_details = user_data_from_github_data(user_hash)

      if user = User.find_by_github_id(user_details['github_id'])
        user.update_attributes(user_details)
        user.recently_signed_up = false
        user
      else
        create!(user_details).tap do |user|
          user.recently_signed_up = true
        end
      end
    end

    def user_data_from_github_data(user_hash)
      user_info = user_hash['user_info']
      {
        'name'  => user_info['name'],
        'email' => user_info['email'],
        'login' => user_info['nickname'],
        'github_id' => user_hash['uid'],
        'github_oauth_token' => user_hash['credentials']['token']
      }
    end
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end

  attr_accessor :recently_signed_up
  def recently_signed_up?
    !!@recently_signed_up
  end

  private

  def create_a_token
    self.tokens.create!
  end
end
