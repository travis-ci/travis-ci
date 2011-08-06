require 'travis'

class BuildsController < ApplicationController
  respond_to :json

  # github does not currently post the payload with the correct
  # accept or content-type headers, we need to change the
  # the github-service code for this to work correctly
  skip_before_filter :verify_authenticity_token, :only => :create

  def index
    repository = Repository.find(params[:repository_id])

    respond_with(repository.builds.recent((params[:page] || 1).to_i))
  end

  def show
    build = Build.find(params[:id])

    respond_with(build)
  end

  def create
    Request.create_from_github_payload(params[:payload], api_token)

    render :nothing => true
  end

  def update
    request = Request.find(params[:id])
    request.configure(params[:payload])

    render :nothing => true
  end

  def log
    build = Build.find(params[:id], :select => "id, repository_id, parent_id", :include => [:repository])

    build.append_log!(params[:build][:log]) unless build.finished?
    # TODO need to figure out how to trigger state updates here, or maybe trigger notifications manually
    # trigger('build:log', build, 'build' => { '_log' => params[:build][:log] }, 'msg_id' => params[:msg_id])
    render :nothing => true
  end

  protected
    def api_token
      credentials = ActionController::HttpAuthentication::Basic.decode_credentials(request)
      credentials.split(':').last
    end
end
