class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController

  def github
    @user = User.find_for_github_oauth(env["omniauth.auth"])

    if @user.persisted?
      flash[:notice] = I18n.t "devise.omniauth_callbacks.success", :kind => "GitHub"
      sign_in @user, :event => :authentication
    end

    if @user.recently_signed_up?
      # for some reason, if i use root_url(:anchor => "!/welcome") rails
      # feels the need to escape the '/' thus breaking backbone.
      redirect_to profile_url(:welcome => true)
    else
      redirect_to root_url
    end
  end

  protected

    def after_omniauth_failure_path_for(scope)
      '/'
    end

end
