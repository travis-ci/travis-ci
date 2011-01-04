class ApplicationController < ActionController::Base
  protect_from_forgery

  def index
    render :text => '', :layout => 'application'
  end

  protected

    def repositories
      @repositories ||= Repository.timeline
    end
    helper_method :repositories

    def authenticate
      authenticate_or_request_with_http_basic do |name, password|
        accounts[name] == password
      end
    end

    def accounts
      @accounts ||= Travis.config['accounts'] || {}
    end
end
