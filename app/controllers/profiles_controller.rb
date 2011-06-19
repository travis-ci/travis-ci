class ProfilesController < ApplicationController
  before_filter :authenticate_user!

  def service_hooks
    repositories = Repository.github_repos_for_user(current_user)

    respond_to do |format|
      format.json { render :json => repositories }
    end
  end

  def add_service_hook
    args = [params[:owner], params[:name], current_user]

    repository = Repository.find_or_create_and_add_service_hook(*args)

    render :json => repository
  rescue ActiveRecord::RecordInvalid, Travis::GitHubApi::ServiceHookError => e
    render :json => repository, :status => :not_acceptable
  end

  def remove_service_hook
    args = [params[:owner], params[:name], current_user]

    repository = Repository.find_and_remove_service_hook(*args)

    render :json => repository
  rescue Travis::GitHubApi::ServiceHookError => e
    render :json => @repository, :status => :not_acceptable
  end

end
