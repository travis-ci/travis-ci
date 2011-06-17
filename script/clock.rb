$: << 'lib'

require 'travis'
require 'resque/heartbeat'

handler do |job|
  Resque.redis = Travis.config['redis']['url']
  Resque.prune_dead_workers
  Resque.redis.instance_variable_get(:@redis).client.disconnect
end

every 5.seconds, 'travis.purge_dead_workers'
