%w(redirect_to process_action start_processing send_data write_fragment exist_fragment? send_file).each do |event|
  ActiveSupport::Notifications.unsubscribe "#{event}.action_controller"
end

%w{render_template render_partial render_collection}.each do |event|
  ActiveSupport::Notifications.unsubscribe "#{event}.action_view"
end

module Travis
  class RequestLogSubscriber < ActiveSupport::LogSubscriber
    def process_action(event)
      payload = event.payload
      message = "#{payload[:method]} #{payload[:path]} format=#{payload[:format]} action=#{payload[:params]['controller']}##{payload[:params]['action']}"
      message << extract_status(payload)
      message << runtimes(event)
      logger.info(message)
    end

    private

    def extract_status(payload)
      if payload[:status]
        " status=#{payload[:status]}"
      elsif payload[:exception]
        exception, message = payload[:exception]
        " status=500 error='#{exception}:#{message}'"
      end
    end

    def runtimes(event)
      message = ""
      {:duration => event.duration,
       :view => event.payload[:view_runtime],
       :db => event.payload[:db_runtime]}.each do |name, runtime|
        message << " #{name}=%.2f" % runtime if runtime
      end
      message
    end

    def logger
      ActionController::Base.logger
    end
  end
end

Travis::RequestLogSubscriber.attach_to :action_controller
