require 'travis'

class BuildsController < ApplicationController
  responders :rabl
  respond_to :json

  # Github does not currently post the payload with the correct accept or content-type headers.
  # We need to change Github's service-hook code for this to work correctly.
  skip_before_filter :verify_authenticity_token, :only => :create

  def index
    respond_with builds
  end

  def show
    respond_with build
  end

  protected

    def builds
      @builds ||= Repository.find(params[:repository_id]).builds.recent(params.slice(:page))
    end

    def build
      @build ||= Build.find(params[:id])
    end
end
