namespace :heroku do
  task :config do
    remote = ENV['REMOTE']
    remote_path = (remote ? " --remote #{remote}" : nil)

    if YAML.const_defined?("ENGINE")
      YAML::ENGINE.yamler = 'syck'
    end

    Bundler.with_clean_env do
      ENV['RUBYOPT'] = nil
      puts "Reading config/travis.yml and sending config vars to Heroku#{remote} ..."
      config = YAML.load_file(Rails.root + 'config/travis.yml')[remote || 'production'] rescue {}
      system("heroku config:add travis_config=#{Shellwords.escape(YAML.dump(config))}#{remote_path}")
      system("heroku restart#{remote_path}")
    end
  end

  namespace :staging do
    task :config do
      ENV['REMOTE'] = 'staging'
      Rake::Task['heroku:config'].invoke
    end
  end

  namespace :production do
    task :config do
      ENV['REMOTE'] = 'production'
      Rake::Task['heroku:config'].invoke
    end
  end
end
