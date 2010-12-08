require 'nanite'

class RepositoriesController < ApplicationController

  protected

    def repository
      @repository ||= Repository.find(params[:id])
    end
    helper_method :repository
end



