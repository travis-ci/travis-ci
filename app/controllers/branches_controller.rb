class BranchesController < ApplicationController
  respond_to :json

  def index
    render :json => branches
  end

  protected

    def branches
      Travis::Api::Http.data(repository, params, :type => :branches, :version => 'v2')
    end

    def repository
      @repository ||= Repository.find(params[:repository_id])
    end
end
