source :rubygems

gem 'rails',             '~> 3.1.0'
gem 'rake',              '~> 0.9.2'
gem 'refraction',        '~> 0.2.0'
gem 'jruby-openssl',     :platforms => :jruby

# persistence
gem 'pg',                '~> 0.11.0'
gem 'silent-postgres',   '~> 0.0.8'
gem 'data_migrations',   '~> 0.0.1'
gem 'resque',            '~> 1.17.1'
gem 'resque-heartbeat',  '~> 0.0.3'

# structures
gem 'json'
gem 'yajl-ruby',         '~> 0.8.2'
gem 'hashr',             '~> 0.0.14'
gem 'rabl',              '~> 0.3.0'

# app
gem 'devise',            '~> 1.4.2'
gem 'oa-oauth',          :git => 'git://github.com/intridea/omniauth.git', :ref => '4bc762da3beb10e75468' # current release depends on faraday 0.6.1, octokit on faraday ~> 0.7.3
gem 'simple_states',     '0.0.7'
gem 'unobtrusive_flash', '~> 0.0.2'

# apis
gem 'octokit',           '~> 0.6.4'
gem 'pusher',            '~> 0.8.1'
gem 'hoptoad_notifier',  '~> 2.4.11'
gem 'newrelic_rpm',      '~> 3.1.0'

# assets
gem 'sass'
gem 'sass-rails',        '~> 3.1.0'
gem 'coffee-rails',      '~> 3.1.0'
gem 'handlebars-rails',  :git => 'git://github.com/svenfuchs/handlebars-rails.git'
gem 'uglifier'
gem 'jquery-rails'
gem 'compass',           :git => 'https://github.com/chriseppstein/compass.git', :branch => 'rails31'

# heroku
gem 'unicorn',           '~> 4.0.0', :platforms => :ruby
gem 'SystemTimer',       '~> 1.2.3', :platforms => :ruby_18
gem 'clockwork'

group :test do
  gem 'capybara',        '~> 1.0.0'
  gem 'database_cleaner'
  gem 'factory_girl',    '~> 2.0.3'
  gem 'mocha'
  gem 'fakeredis',       '~> 0.2.0'
  gem 'webmock'

  platforms :ruby_18 do
    gem 'minitest'
    gem 'minitest_tu_shim'
  end
end

group :development, :test do
  gem 'rspec-rails', '~> 2.6.1'

  platforms :mri_18 do
    # required as linecache uses it but does not have it as a dep
    gem 'require_relative', '~> 1.0.1'
    gem 'ruby-debug'
  end

  unless RUBY_VERSION == '1.9.3' && RUBY_PLATFORM !~ /darwin/
    # will need to install ruby-debug19 manually:
    # gem install ruby-debug19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.3-preview1
    gem 'ruby-debug19', :platforms => :mri_19
  end
end

