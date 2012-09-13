require 'responders'

module V1
  class RepositoriesController < ApplicationController
    # TODO for some reason this doesn't work with an ApiController
    # sending_file= seems to be called on an nil response
    # include ActionController::DataStreaming

    helper :repositories

    responders :json, :xml, :result_image

    respond_to :json, :xml
    respond_to :png, :only => :show

    def index
      respond_with(repositories)
    end

    def show
      respond_with(repository)
    end

    protected

      def repositories
        service(:repositories).find_all(params)
      end

      def repository
        @repository ||= service(:repositories).find_one(params)
      rescue ActiveRecord::RecordNotFound
        raise unless params[:format] == 'png'
      end
  end
end
