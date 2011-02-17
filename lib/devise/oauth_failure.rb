module Devise
  class OauthFailure < Devise::FailureApp
    def respond
      if request.params[:error] = 'user_denied'
        flash[:failure] = i18n_message(:oauth_denied)
        redirect_to '/'
      else
        super
      end
    end
  end
end
