require 'travis'

Resque.redis  = ENV['REDIS_URL']     || Travis.config['redis']['url']
Pusher.app_id = ENV['pusher_app_id'] || Travis.config['pusher']['app_id']
Pusher.key    = ENV['pusher_key']    || Travis.config['pusher']['key']
Pusher.secret = ENV['pusher_secret'] || Travis.config['pusher']['secret']


