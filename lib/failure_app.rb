require 'devise'

class Travis::FailureApp < Devise::FailureApp
  def redirect_url
    sign_in_path
  end
end
