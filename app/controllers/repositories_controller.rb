class RepositoriesController < ApplicationController
  respond_to :json

  def index
    render :json => repositories.as_json
  end

  def show
    render :json => repository.as_json
  end

  protected

    def repositories
      params[:username] ? Repository.where(:username => params[:username]) : Repository.all
    end

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end



