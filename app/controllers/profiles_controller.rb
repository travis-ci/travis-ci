require 'responders'

class ProfilesController < ApplicationController
  include SyncHelper

  layout 'profile'

  before_filter :authenticate_user!

  responders :json
  respond_to :json
  respond_to :html, :only => :show

  def show
    respond_with user
  end

  def update
    update_locale
    redirect_to :profile
  end

  def sync
    sync_user(user)
    render :text => 'ok'
  end

  def repositories
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

    def owners
      @owners ||= [current_user] + Organization.where(:login => owner_names)
    end
    helper_method :owners

    def owner_names
      current_user.repositories.administratable.select(:owner_name).map(&:owner_name).uniq
    end
end
