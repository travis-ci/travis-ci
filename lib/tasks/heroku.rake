namespace :heroku do
  task :config do
    remote = ENV['RACK_ENV'] || 'staging'

    Bundler.with_clean_env do
      puts "Reading config/travis.yml and sending config vars to Heroku #{remote} ..."
      config = YAML.load_file('config/travis.yml')[remote] rescue {}
      system("heroku config:add travis_config=#{Shellwords.escape(YAML.dump(config))} --remote #{remote}")
      system("heroku restart --remote #{remote}")
    end
  end

  namespace :staging do
    task :config do
      ENV['RACK_ENV'] = 'staging'
      Rake::Task['heroku:config'].invoke
    end
  end

  namespace :production do
    task :config do
      ENV['RACK_ENV'] = 'production'
      Rake::Task['heroku:config'].invoke
    end
  end
end
