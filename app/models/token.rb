class Token < ActiveRecord::Base
  belongs_to :user

  before_create :generate_token

  protected
    def generate_token
      self.token = Devise.friendly_token.first(20)
    end
end
