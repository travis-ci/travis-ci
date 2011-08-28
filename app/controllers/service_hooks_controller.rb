class ServiceHooksController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid, Travis::GithubApi::ServiceHookError, :with => :not_acceptable

  layout 'simple'

  before_filter :authenticate_user!

  respond_to :json

  def index
    respond_with(repositories)
  end

  def update
    repository.service_hook.toggle(params[:active], current_user)
    respond_with(repository)
  end

  private

    def repositories
      @repositories ||= current_user.github_repositories
    end

    def repository
      @repository ||= Repository.find_or_create_by_owner_name_and_name(params[:owner], params[:name])
    end
end

