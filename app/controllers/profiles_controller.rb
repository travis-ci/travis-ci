class ProfilesController < ApplicationController
  before_filter :authenticate_user!

  respond_to :json
  respond_to :html, :only => :show

  def show
    @user = current_user

    respond_with(@user)
  end

  def service_hooks
    repositories = Repository.github_repos_for_user(current_user)

    respond_with(repositories)
  end

  def add_service_hook
    repository = Repository.find_or_create_and_add_service_hook(*service_hook_args)

    respond_with(repository)
  rescue ActiveRecord::RecordInvalid, Travis::GitHubApi::ServiceHookError => e
    respond_with(repository, :status => :not_acceptable)
  end

  def remove_service_hook
    repository = Repository.find_and_remove_service_hook(*service_hook_args)

    respond_with(repository)
  rescue Travis::GitHubApi::ServiceHookError => e
    respond_with(repository, :status => :not_acceptable)
  end

  private

    def service_hook_args
      [params[:owner], params[:name], current_user]
    end
end
