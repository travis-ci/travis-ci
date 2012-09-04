module V1
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => branches.data if stale? branches
    end

    protected

      def repository
        @repository ||= Repository.find_by(params) || not_found
      end

      def branches
        Travis::Api.builder(repository, :type => :branches, :params => params, :version => 'v1')
      end
  end
end
