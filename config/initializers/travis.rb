require 'travis'

if Travis.config.redis?
  Resque.redis = Travis.config.redis.url
end
