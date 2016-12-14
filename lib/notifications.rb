require 'active_support/notifications'

module Travis
  class Metrics
    def initialize
      @env = ENV['ENV'] || "production"
    end

    def metric_name(name)
      "travis.#{@env}.#{name}"
    end

    def subscribe
      ActiveSupport::Notifications.subscribe(%r{^github\.requests.*}) do |name, source, payload|
        if source
          Metriks.meter(metric_name(name), source).mark
        else
          Metriks.meter(metric_name(name)).mark
        end
      end
    end
  end
end

Travis::Metrics.new.subscribe
