require 'responders'

class BranchesController < ApplicationController
  responders :rabl

  respond_to :json

  def index
    respond_with builds
  end

  protected

    def repository
      @repository ||= Repository.find_by(params) || not_found
    end

    def builds
      @builds= repository.last_finished_builds_by_branches
    end
end
