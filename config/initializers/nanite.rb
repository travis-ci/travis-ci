unless Rails.env.test?
  Thread.new do
    sleep 1 until EM.reactor_running?
    config = YAML.load(File.read('config/nanite.yml'))
    Nanite.start_mapper(config)
  end
end
