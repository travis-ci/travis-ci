require 'active_support/notifications'

ActiveSupport::Notifications.subscribe(%r{^github\.requests.*}) do |name, source, payload|
  if source
    Metriks.meter(name, source).mark
  else
    Metriks.meter(name).mark
  end
end
