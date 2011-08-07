require 'travis'

class BuildsController < ApplicationController
  respond_to :json

  # github does not currently post the payload with the correct
  # accept or content-type headers, we need to change the
  # the github-service code for this to work correctly
  skip_before_filter :verify_authenticity_token, :only => :create

  def index
    respond_with recent_builds
  end

  def show
    respond_with build
  end

  def create
    Request.create_from_github_payload(params[:payload], api_token)
    render :nothing => true
  end

  def update
    Request.find(params[:id]).configure(params[:payload])
    render :nothing => true
  end

  def log
    Task::Test.append_log!(params[:id], params[:build][:log])
    render :nothing => true
  end

  protected

    def recent_builds
      Repository.find(params[:repository_id]).builds.recent((params[:page] || 1).to_i)
    end

    def build
      Build.find(params[:id])
    end

    def api_token
      credentials = ActionController::HttpAuthentication::Basic.decode_credentials(request)
      credentials.split(':').last
    end
end
