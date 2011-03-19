require 'travis'

if Travis.config['redis']
  Resque.redis  = Travis.config['redis']['url']
end

if Travis.config['pusher']
  Pusher.app_id = Travis.config['pusher']['app_id']
  Pusher.key    = Travis.config['pusher']['key']
  Pusher.secret = Travis.config['pusher']['secret']
  Travis.pusher = Pusher
end

if defined?(Thin)
  require 'resque/heartbeat'

  Thread.new do
    sleep(0.5) until EM.reactor_running?
    EM.add_periodic_timer(3) { Resque.prune_dead_workers }
  end
end
