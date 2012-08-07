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
      repository.service_hook.set(params[:active] == 'true', current_user)
      respond_with(repository)
    end

    private

      def service_hooks
        @service_hooks ||= current_user.service_hooks(:owner_name => params[:owner_name])
      end

      def repository
        @repository ||= Repository.find_or_create_by_owner_name_and_name(params[:owner_name], params[:name])
      end
  end
end
