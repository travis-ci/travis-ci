class ActionControllerMetricsLogSubscriber < ActiveSupport::LogSubscriber
  def process_action(event)
    keys = [
      'action_controller.requests',
      "action_controller.requests.#{event.payload[:params]['controller'].gsub('/', '.')}"
    ]
    keys.each do |key|
      Metriks.timer(key).update(event.duration)
    end
  end

  def self.attach
    attach_to(:action_controller)
  end
end
