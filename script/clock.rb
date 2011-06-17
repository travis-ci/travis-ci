$: << 'lib'

require 'travis'
require 'resque/heartbeat'

handler do |job|
  Resque.redis = Travis.config['redis']['url']
  Resque.prune_dead_workers
end

every 5.seconds, 'travis.purge_dead_workers'

