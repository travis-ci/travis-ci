class ServiceHooksController < ApplicationController
  rescue_from ActiveRecord::RecordInvalid, Travis::GithubApi::ServiceHookError, :with => :not_acceptable

  layout 'simple'

  before_filter :authenticate_user!

  respond_to :json

  def index
    respond_with(service_hooks)
  end

  def update
    repository.service_hook.set(params[:active], current_user)
    respond_with(repository)
  end

  private

    def service_hooks
      @service_hooks ||= current_user.github_service_hooks
    end

    def repository
      @repository ||= Repository.find_or_create_by_owner_name_and_name(params[:owner_name], params[:name])
    end
end

