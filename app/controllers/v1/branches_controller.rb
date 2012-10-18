module V1
  class BranchesController < ApiController
    respond_to :json

    def index
      render :json => branches.data if stale? branches
    end

    protected

      def branches
        branches = service(:branches, :find_all, params).run
        Travis::Api.new(branches, :type => :branches, :params => params, :version => 'v1')
      end
  end
end
