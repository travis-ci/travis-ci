class RepositoriesController < ApplicationController
  respond_to :json

  def index
    respond_with(repositories)
  end

  def show
    respond_with(repository)
  end

  protected
    def repositories
      params[:username] ? Repository.where(:username => params[:username]).timeline : Repository.timeline.recent
    end

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end
