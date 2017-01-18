class Token < ActiveRecord::Base
  belongs_to :user

  validate :token, :presence => true

  before_validation :generate_token

  attr_accessible # nothing is changable

  protected

    def generate_token
      self.token = Devise.friendly_token.first(20)
    end

end
