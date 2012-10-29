require 'responders'

class ProfilesController < ApplicationController
  include SyncHelper

  layout 'profile'

  before_filter :authenticate_user!
  before_filter :first_sync, :only => :show
  before_filter :verify_tab
  before_filter :verify_owner

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

    def verify_tab
      params.delete(:tab) if params[:tab] && !display_tab?(params[:tab])
      params[:tab] ||= tabs.first
    end

    def verify_owner
      not_found unless owner
    end

    def tabs
      @tabs ||= %w(repos profile).select { |tab| display_tab?(tab) }
    end
    helper_method :tabs

    def current_tab
      params[:tab]
    end
    helper_method :current_tab

    def display_tab?(tab)
      tab != 'profile' || owner == current_user
    end
    helper_method :display_tab?

    def owner
      @owner ||= params[:owner_name] ? owners.detect { |owner| owner.login == params[:owner_name] } : current_user
    end
    helper_method :owner

    def owners
      @owners ||= [current_user] + Organization.where(:login => owner_names)
    end
    helper_method :owners

    def owner_names
      current_user.repositories.administratable.select(:owner_name).map(&:owner_name).uniq
    end

    def repository_counts
      @repository_counts ||= Repository.counts_by_owner_names(owner_names)
    end
    helper_method :repository_counts

    def sync_type
      Travis::Services::Github::SyncUser::Repositories.type
    end
    helper_method :sync_type
end
