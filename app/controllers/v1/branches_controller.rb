module V1
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => branches.data if stale? branches
    end

    protected

      def branches
        Travis::Api.new(repository, :type => :branches, :params => params, :version => 'v1')
      end

      def repository
        service(:repositories).find_one(params) || not_found
      end
  end
end
