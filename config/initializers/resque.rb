config = YAML.load_file(Rails.root.join('config/resque.yml'))
Resque.redis = config[Rails.env]
