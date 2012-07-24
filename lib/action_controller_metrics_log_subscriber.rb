class ActionControllerMetricsLogSubscriber < ActiveSupport::LogSubscriber
  def process_action(event)
    Metriks.timer('action_controller.requests').update(event.duration)
  end

  def self.attach
    attach_to(:action_controller)
  end
end
