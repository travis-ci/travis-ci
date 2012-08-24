require 'http_accept_language'
require 'responders'

class ApplicationController < ActionController::Base
  extend Responders::ControllerMethod

  rescue_from ActiveRecord::RecordNotFound, :with => :not_found

  protect_from_forgery

  before_filter :set_gitsha_header
  before_filter :prepare_for_mobile
  before_filter :set_locale
  after_filter  :prepare_unobtrusive_flash

  def not_found
    render :file => "#{Rails.root}/public/404", :formats => [:html], :status => 404, :layout => false
  end

  protected

    def set_locale
      locale_by_param if params[:hl]

      locale = if session[:locale]
         session[:locale].to_sym
       elsif user_signed_in? && current_user.locale
         current_user.locale.to_sym
       elsif request.env['HTTP_ACCEPT_LANGUAGE']
         request.preferred_language_from(I18n.available_locales)
       else
         I18n.default_locale
       end

      I18n.locale = locale || I18n.default_locale
    end

    def locale_by_param
      session[:locale] = request.query_parameters.delete(:hl)
      query = request.query_parameters.map { |key, value| "#{key}=#{value.to_s}" }.join('&')
      path = query.blank? ? request.path : ("#{request.path}?#{query}")
      redirect_to path
    end

    def title
      'Travis CI - Hosted Continuous Integration for the Open Source Community'
    end
    helper_method :title

    def repositories
      @repositories ||= Repository.timeline
    end
    helper_method :repositories

    def set_gitsha_header
      headers['X-GIT_SHA'] = ENV['GIT_SHA'] if ENV['GIT_SHA']
    end

    def mobile?
      if session[:mobile_param]
        session[:mobile_param] == '1'
      else
        request.user_agent =~ /Mobile|webOS/
      end
    end
    helper_method :mobile?

    def prepare_for_mobile
      session[:mobile_param] = params[:mobile] if params[:mobile]
    end
end
