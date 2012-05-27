require 'responders'

module V2
  class ArtifactsController < ApiController
    responders :json
    respond_to :json

    def show
      respond_with artifact
    end

    protected

      def artifact
        @artifact ||= Artifact.find(params[:id])
      end
  end
end

