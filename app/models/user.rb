class User < ActiveRecord::Base
  devise :omniauthable, :api_token_authenticatable

  has_many :tokens

  attr_accessible :name, :login, :email, :github_id, :github_oauth_token

  after_create :create_a_token

  class << self
    def find_or_create_for_oauth(payload)
      data = user_data_from_oauth(payload)
      User.find_by_github_id(data['github_id']) || create!(data)
    end

    def user_data_from_oauth(payload)
      {
        'name'  => payload['user_info']['name'],
        'email' => payload['user_info']['email'],
        'login' => payload['user_info']['nickname'],
        'github_id' => payload['uid'],
        'github_oauth_token' => payload['credentials']['token']
      }
    end
  end

  before_create do
    @recently_signed_up = true
  end

  def recently_signed_up?
    !!@recently_signed_up
  end

  def profile_image_hash
    self.email? ? Digest::MD5.hexdigest(self.email) : '00000000000000000000000000000000'
  end

  def github_repositories
    states = Repository.where(:owner_name => login).active_by_name
    Travis::GithubApi.repositories_for_user(login).each_with_index do |repository, ix|
      repository.uid = [login, ix].join(':')
      repository.active = states[repository.name] || false
    end
  end

  private

    def create_a_token
      self.tokens.create!
    end
end
