require 'sidekiq'
require 'travis/sidekiq/workers'

Sidekiq.configure_client do |config|
  config.redis = Travis.config.redis.merge(size: 1, namespace: 'sidekiq')
end
