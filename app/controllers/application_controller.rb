class ApplicationController < ActionController::Base
  protect_from_forgery

  protected

    def repositories
      @repositories ||= Repository.order('last_built_at DESC')
    end
    helper_method :repositories
end
