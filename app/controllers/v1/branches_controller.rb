module V1
  class BranchesController < ApplicationController
    respond_to :json

    def index
      render :json => branches
    end

    protected

      def repository
        @repository ||= Repository.find(params[:repository_id])
      end

      def branches
        Travis::Api::Http::V1::Branches.new(repository).data
      end
  end
end
