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
      message << " status=#{payload[:status]}"
      message << runtimes(event)
      logger.info(message)
    end

    private
    def runtimes(event)
      message = ""
      if event.duration
        message << " duration=%.2f" % event.duration
      end

      if event.payload[:view_runtime]
        message << " view=%.2f" % event.payload[:view_runtime]
      end

      if event.payload[:db_runtime]
        message << " db=%.2f" % event.payload[:db_runtime]
      end
      message
    end

    def logger
      ActionController::Base.logger
    end
  end
end

Travis::RequestLogSubscriber.attach_to :action_controller
