module V2
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => branches
    end

    protected

      def branches
        Travis::Api.data(repository, :type => :branches, :params => params, :version => 'v2')
      end

      def repository
        @repository ||= Repository.find(params[:repository_id])
      end
  end
end
