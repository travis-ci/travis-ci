RSpec.configure do |config|
  config.include Devise::TestHelpers, :type => :controller
end

module Support
  module Devise
    include ::Devise::TestHelpers

    def sign_in_new_user
        sign_in_user Factory(:user)
    end

    def sign_in_user(user)
        @request.env["devise.mapping"] = ::Devise.mappings[:user]
        sign_in user
    end
  end
end
