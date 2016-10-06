namespace :heroku do
  task :config do
    remote = ENV['REMOTE']
    remote = " --remote #{remote}" if remote

    Bundler.with_clean_env do
      puts "Reading config/travis.yml and sending config vars to Heroku#{remote} ..."
      config = YAML.load_file('config/travis.yml')[remote || 'production'] rescue {}
      system("heroku config:add travis_config=#{Shellwords.escape(YAML.dump(config))}#{remote}")
      system("heroku restart#{remote}")
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
