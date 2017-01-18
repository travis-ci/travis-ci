class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def github
    @user = User.find_or_create_for_oauth(env["omniauth.auth"])

    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "GitHub"
      sign_in @user, :event => :authentication
    end

    if @user.recently_signed_up?
      redirect_to profile_url
    else
      redirect_to root_url
    end
  end

  protected

    def after_omniauth_failure_path_for(scope)
      '/'
    end

end
