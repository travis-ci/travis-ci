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
end
