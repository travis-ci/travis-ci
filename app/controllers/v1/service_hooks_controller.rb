module V1
  class ServiceHooksController < ApiController
    include AbstractController::Callbacks
    include Devise::Controllers::Helpers

    rescue_from ActiveRecord::RecordInvalid, :with => Proc.new { head :not_acceptable }

    before_filter :authenticate_user!

    respond_to :json

    def index
      respond_with(service_hooks)
    end

    def update
      run_service(:update_hook, id: repository.id, active: params[:active] == 'true')
      respond_with(repository)
    end

    private

      def service_hooks
        @service_hooks ||= run_service(:find_hooks, params)
      end

      def repository
        @repository ||= service(:find_repo, params.slice(:owner_name, :name)).run
      end
  end
end
