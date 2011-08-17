module Devise
  module SignInHelpers
    # Creates a user form Factory and signs her in
    def sign_in_new_user
        @user = FactoryGirl.create(:user)
        sign_in_user @user
    end

    # Signs in given user
    def sign_in_user user
        @request.env["devise.mapping"] = Devise.mappings[:user]
        sign_in user
    end
  end
end
