module V1
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => branches
    end

    protected

      def repository
        @repository ||= Repository.find(params[:repository_id])
      end

      def branches
        Travis::Api.data(repository, :type => :branches, :params => params, :version => 'v1')
      end
  end
end
