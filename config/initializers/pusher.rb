def pusher_config
  @pusher_config ||= YAML.load_file(Rails.root.join('config/builder.yml'))['pusher']
end

Pusher.app_id = ENV['pusher_app_id'] || pusher_config['app_id']
Pusher.key    = ENV['pusher_key']    || pusher_config['key']
Pusher.secret = ENV['pusher_secret'] || pusher_config['secret']

