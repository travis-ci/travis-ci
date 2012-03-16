class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, :with => :not_found

  prepend_view_path 'app/views/v1/default'

  protect_from_forgery

  before_filter :set_gitsha_header
  before_filter :prepare_for_mobile
  after_filter  :prepare_unobtrusive_flash

  def not_found
    render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
  end

  protected

    def repositories
      @repositories ||= Repository.timeline
    end
    helper_method :repositories

    def set_gitsha_header
      headers['X-GIT_SHA'] = ENV['GIT_SHA'] if ENV['GIT_SHA']
    end

    def mobile_device?
      if session[:mobile_param]
        session[:mobile_param] == '1'
      else
        request.user_agent =~ /Mobile|webOS/
      end
    end
    helper_method :mobile_device?

    def prepare_for_mobile
      session[:mobile_param] = params[:mobile] if params[:mobile]
    end

end
