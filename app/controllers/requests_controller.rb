class RequestsController < ApplicationController
  # also responds to POST /builds legacy route
  def create
    Travis::Models::Request.create(params[:payload], api_token)
    render :nothing => true
  end

  protected

    def api_token
      credentials = ActionController::HttpAuthentication::Basic.decode_credentials(request)
      credentials.split(':').last
    rescue
      ''
    end
end
