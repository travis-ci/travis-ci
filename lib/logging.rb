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
      message << (" status=#{payload[:status]} duration=%.2f view=%.2f db=%.2f" % [event.duration, payload[:view_runtime], payload[:db_runtime]])
      logger.info(message)
    end

    def start_processing(event)
    end

    def redirect_to(event)
    end

    def logger
      ActionController::Base.logger
    end
  end
end

Travis::RequestLogSubscriber.attach_to :action_controller
