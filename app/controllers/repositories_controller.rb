class RepositoriesController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json { render :json => Repository.all.as_json }
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json { render :json => repository.as_json }
    end
  end

  protected

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end



