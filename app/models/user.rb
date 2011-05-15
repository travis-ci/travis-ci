class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  attr_accessible :name, :login, :email, :github_id

  after_create :create_a_token

  def self.find_for_github_oauth(user_hash)
    data = user_hash['extra']['user_hash']
    if user = User.find_by_github_id(data["id"])
      user.update_attributes( User::user_data_from_github_data(data) )
      user
    else
      create!(User::user_data_from_github_data(data))
    end
  end

  def self.user_data_from_github_data(data)
    data.slice!(*%w{id name login email})
    data['github_id'] = data['id']
    data.delete 'id'
    data
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end

  private

  def create_a_token
    self.tokens.create!
  end
end
