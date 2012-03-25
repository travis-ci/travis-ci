source :rubygems

# see https://gist.github.com/2063855
base ||= 'git://github.com/travis-ci'
type = base[0, 2] == '..' ? :path : :git

gem 'travis-core',    type => "#{base}/travis-core", :require => 'travis/engine'
gem 'travis-support', type => "#{base}/travis-support"

gem 'rails',                '~> 3.2.1'
gem 'sinatra',              '~> 1.3.1'
gem 'rake',                 '~> 0.9.2.2'
gem 'amqp',                 '~> 0.9.0'

# app
gem 'refraction',           '~> 0.2.0'
gem 'devise',               '~> 1.5.0'
gem 'omniauth-github',      '~> 1.0.0'
gem 'unobtrusive_flash',    '~> 0.0.2'

# structures
gem 'json',                 '~> 1.6.3'
gem 'yajl-ruby',            '~> 1.1.0'
gem 'rabl',                 '~> 0.5.1'
gem 'rack-contrib', git: 'git://github.com/rack/rack-contrib', require: 'rack/contrib'

# db
gem 'pg',                   '~> 0.13.2'

# apis + metrics
gem 'gh',           git: 'git://github.com/rkh/gh.git'
gem 'hubble',       git: 'git://github.com/mattmatt/hubble'
gem 'metriks',      git: 'git://github.com/mattmatt/metriks', ref: 'source'
gem 'newrelic_rpm',         '~> 3.3.0'

# i18n
gem "localeapp",            "~> 0.4.1"
gem "http_accept_language", "~> 1.0.2"

# heroku
gem 'unicorn',              '~> 4.1.1'

# assets
group :assets do
  gem 'sass-rails',         '~> 3.2.4'
  gem 'coffee-rails',       '~> 3.2.2'
  gem 'uglifier',           '~> 1.2.0'
  gem 'compass',            '0.12.alpha.4'
  gem "i18n-js",            '~> 2.1.2'
end

group :development, :test do
  gem 'factory_girl',       '~> 2.4.0'
  gem 'forgery',            '~> 0.5.0'
  gem 'rspec-rails',        '~> 2.8.0'
  gem 'thin',               '~> 1.3.1'
end

group :development do
  gem 'foreman',            '~> 0.36.0'

  unless RUBY_VERSION == '1.9.3' && RUBY_PLATFORM !~ /darwin/
    # will need to install ruby-debug19 manually:
    # gem install ruby-debug19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.3-preview1
    gem 'ruby-debug19', :platforms => :mri_19
  end
end

group :test do
  gem 'jasmine',           git: 'git://github.com/pivotal/jasmine-gem.git', submodules: true
  gem 'capybara',          '~> 1.1.2'
  gem 'database_cleaner',  '~> 0.7.0'
  gem 'mocha',             '~> 0.10.0'
  gem 'webmock',           '~> 1.7.7'

  # gotta wait for QT 4.7
  # gem 'jasmine-headless-webkit'
end
