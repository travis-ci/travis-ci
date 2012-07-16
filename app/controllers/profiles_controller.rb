class ProfilesController < ApplicationController
  include SyncHelper

  layout 'simple'

  before_filter :authenticate_user!

  respond_to :json
  respond_to :html, :only => :show

  def show
    # TODO extract json to travis-core/api and use the json responder
    respond_to do |format|
      format.html do
        @user = user
        render :show
      end
      format.json do
        render :json => {
          login: user.login,
          name: user.name,
          gravatar_id: user.gravatar_id,
          email: user.email,
          locale: user.locale,
          is_syncing: user.is_syncing,
          synced_at: user.synced_at
        }
      end
    end
  end

  def update
    update_locale
    redirect_to :profile
  end

  def sync
    sync_user(user)
    render :text => 'ok'
  end

  private

    def update_locale
      locale = params[:user][:locale].to_sym
      valid = I18n.available_locales.include?(locale)
      if valid
        user.locale = locale.to_s
        user.save!
        session[:locale] = locale
        set_locale
      end
    end

    def user
      @user ||= current_user
    end
end
