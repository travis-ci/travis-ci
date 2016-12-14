module V2
  class ServiceHooksController < ApiController
    include AbstractController::Callbacks
    include Devise::Controllers::Helpers

    rescue_from ActiveRecord::RecordInvalid, :with => Proc.new { head :not_acceptable }

    before_filter :authenticate_user!

    respond_to :json

    def index
      respond_with(:service_hooks => service_hooks)
    end

    def update
      service_hook.set(payload[:active], current_user)
      respond_with(:service_hook => service_hook)
    end

    private

      def service_hooks
        @service_hooks ||= current_user.service_hooks
      end

      def repository
        @repository ||= Repository.find_or_create_by_owner_name_and_name(params[:owner_name], params[:name])
      end

      def service_hook
        repository.service_hook
      end

      def payload
        params[:service_hook] || {}
      end
  end
end
