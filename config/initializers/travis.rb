require 'travis'

if Travis.config['redis']
  Resque.redis = Travis.config['redis']['url']
end

if Travis.config['pusher']
  Pusher.app_id = Travis.config['pusher']['app_id']
  Pusher.key    = Travis.config['pusher']['key']
  Pusher.secret = Travis.config['pusher']['secret']
  Travis.pusher = Pusher
end
