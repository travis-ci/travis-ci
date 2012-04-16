class RequestsController < ApplicationController
  # also responds to POST /builds legacy route
  def create
    ActiveSupport::Notifications.publish('github.request.deprecated.api', params)
    Request.create_from(event_type, params[:payload], api_token)
    render :nothing => true
  end

  protected

    def event_type
      request.headers['HTTP_X_GITHUB_EVENT'] || 'push'
    end

    def api_token
      credentials = ActionController::HttpAuthentication::Basic.decode_credentials(request)
      credentials.split(':').last
    rescue
      ''
    end
end
