source :rubygems

ruby '1.9.3' rescue nil

gem 'travis-core',    git: 'git://github.com/travis-ci/travis-core', require: 'travis/engine', branch: 'rkh-track-scopes'
gem 'travis-support', git: 'git://github.com/travis-ci/travis-support'
gem 'travis-sidekiqs', github: 'travis-ci/travis-sidekiqs', require: nil

gem 'rails',                '3.2.8' # TODO current log_rage seems incompatible with 3.2.9
gem 'execjs',               '1.3.0'
gem 'rake',                 '~> 0.9.2.2'
gem 'bunny'
gem 'rack-ssl'

# app
gem 'refraction',           '~> 0.2.0'
gem 'versionist',           '~> 0.2.0'
gem 'devise',               '~> 2.0.4'

# upgrading to newer versions of these gems caused new github accounts to not be able to
# sign in / create an account on our side
gem 'oauth2',               '0.6.1'
gem 'omniauth-oauth2',      '1.0.2'
gem 'omniauth-github',      '1.0.1'

gem 'unobtrusive_flash',    '~> 0.0.2'

# structures
gem 'json',                 '~> 1.6.3'
gem 'yajl-ruby',            '~> 1.1.0'
gem 'rack-contrib', git: 'git://github.com/rack/rack-contrib', require: 'rack/contrib'

# db
gem 'pg',                   '~> 0.13.2'

# apis + metrics
gem 'backports',            '~> 2.3.0'
gem 'gh',           git: 'git://github.com/rkh/gh'
gem 'hubble',       git: 'git://github.com/roidrage/hubble'
gem 'newrelic_rpm',         '~> 3.3.0'
gem 'lograge',              '~> 0.0.4'

# i18n
gem 'http_accept_language', '~> 1.0.2'

# heroku
gem 'unicorn',              '~> 4.1.1'

group :development, :test do
  gem 'thin',               '~> 1.3.1'

  gem 'travis-assets',  git: 'https://github.com/travis-ci/travis-assets', require: 'travis/assets/railtie'
  gem 'rake-pipeline',  git: 'https://github.com/livingsocial/rake-pipeline.git'
  gem 'rake-pipeline-web-filters', git: 'https://github.com/wycats/rake-pipeline-web-filters.git'

  gem 'coffee-script'
  gem 'compass'

  # TODO why do we need these in development?
  gem 'factory_girl',       '~> 2.4.0'
  gem 'forgery',            '~> 0.5.0'
  gem 'rspec-rails',        '~> 2.10.0'
end

group :development do
  gem 'foreman',            '~> 0.36.0'
  # gem 'debugger', platforms: :mri_19
end

group :test do
  gem 'capybara',          '~> 1.1.2'
  gem 'database_cleaner',  '~> 0.7.0'
  gem 'mocha',             '~> 0.10.0'
  gem 'webmock',           '~> 1.7.7'
  gem 'guard'
  gem 'guard-rspec'
  gem 'rb-fsevent'
end
