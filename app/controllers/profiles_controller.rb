require 'responders'

class ProfilesController < ApplicationController
  include SyncHelper
  include Tabs

  helper TabsHelper

  layout 'profile'

  before_filter :authenticate_user!
  before_filter :first_sync, :only => :show
  before_filter :verify_tab

  responders :json
  respond_to :json
  respond_to :html, :only => :show

  def show
    respond_with current_user
  end
  alias :account :show
  alias :repos :show

  def update
    update_locale
    redirect_to :profile
  end

  def syncing
    render :syncing, :layout => 'session'
  end

  def sync
    sync_user(current_user)
    render :text => 'ok'
  end

  private

    def update_locale
      locale = params[:user][:locale].to_sym
      valid = I18n.available_locales.include?(locale)
      if valid
        current_user.locale = locale.to_s
        current_user.save!
        session[:locale] = locale
        set_locale
      end
    end

    def first_sync
      redirect_to syncing_profile_url if current_user && current_user.first_sync? && request.format.html?
    end

    def owner_names
      current_user.repositories.administratable.select(:owner_name).map(&:owner_name).uniq
    end
end
