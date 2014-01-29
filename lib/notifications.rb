require 'active_support/notifications'

module Travis
  class Metrics
    def metric_name(name)
      "travis.#{name}"
    end

    def subscribe
      ActiveSupport::Notifications.subscribe(%r{^github\.requests.*}) do |name, payload|
        Metriks.meter(metric_name(name)).mark
      end
    end
  end
end

Travis::Metrics.new.subscribe
