class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include SyncHelper

  def github
    user = User.find_or_create_for_oauth(env["omniauth.auth"])

    if user.persisted?
      flash[:notice] = I18n.t("devise.omniauth_callbacks.success", kind: "GitHub")
      sign_in(user, event: :authentication)
      sync_user(user)
    end

    redirect_to after_sign_in_path_for(user)
  end

  protected

    def after_omniauth_failure_path_for(user)
      '/'
    end
end
