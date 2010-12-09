class RepositoriesController < ApplicationController
  protected

    def repository
      @repository ||= params[:id] ? Repository.find(params[:id]) : nil
    end
    helper_method :repository
end



