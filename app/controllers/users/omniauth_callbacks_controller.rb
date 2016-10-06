class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def github
    @user = User.find_for_github_oauth(env["omniauth.auth"])

    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "GitHub"
      sign_in @user, :event => :authentication
      redirect_to root_url
    else
      redirect_to root_url
    end
  end

  protected
    def after_omniauth_failure_path_for(scope)
      '/'
    end
end
