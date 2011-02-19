namespace :heroku do
  task :config do
    puts "Reading config/travis.yml and sending config vars to Heroku ..."

    config = YAML.load_file('config/travis.yml')['production'] rescue {}
    command = "heroku config:add travis_config=#{Shellwords.escape(YAML.dump(config))}"

    Bundler.with_clean_env do
      system(command)
      system('heroku restart')
    end
  end
end
