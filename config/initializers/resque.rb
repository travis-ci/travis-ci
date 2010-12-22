def resque_config
  @resque_config ||= YAML.load_file(Rails.root.join('config/resque.yml'))
end

Resque.redis = ENV['REDISTOGO_URL'] || resque_config[Rails.env]
