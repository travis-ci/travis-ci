source :rubygems

gem 'rails',             '~> 3.1.1'
gem 'rake',              '~> 0.9.2'

gem 'travis-core', :git => 'git://github.com/travis-ci/travis-core.git', :require => 'travis_core/engine'
gem 'amqp',              '~> 0.8.3'

# app
gem 'refraction',        '~> 0.2.0'
gem 'devise',            '~> 1.4.2'
gem 'oa-oauth',          '~> 0.3.0'
gem 'unobtrusive_flash', '~> 0.0.2'

# structures
gem 'json'
gem 'yajl-ruby',         '~> 1.0.0'
gem 'rabl',              '~> 0.5.0'

# db
gem 'pg',                '~> 0.11.0'
gem 'silent-postgres',   '~> 0.0.8'

# apis
gem 'hoptoad_notifier',  '~> 2.4.11'
gem 'newrelic_rpm',      '~> 3.2.0'

# heroku
gem 'unicorn',           '~> 4.1.1', :platforms => :ruby
gem 'SystemTimer',       '~> 1.2.3', :platforms => :ruby_18

# assets
group :assets do
  gem 'sass-rails',        '~> 3.1.0'
  gem 'coffee-rails',      '~> 3.1.0'
  gem 'uglifier'
  gem 'compass',           '0.12.alpha.0'
end

group :development, :test, :jasmine do
  gem 'rails-dev-tweaks', '~> 0.5.1'
  gem 'factory_girl',     '~> 2.1.2'
  gem 'forgery',          '~> 0.5.0'
  gem 'rspec-rails',      '~> 2.7.0'
  gem 'thin'
end

group :development do
  gem 'foreman'

  platforms :mri_18 do
    # required as linecache uses it but does not have it as a dep
    gem 'require_relative', '~> 1.0.1'
    gem 'ruby-debug'
    gem 'linecache', '<= 0.45'
  end

  unless RUBY_VERSION == '1.9.3' && RUBY_PLATFORM !~ /darwin/
    # will need to install ruby-debug19 manually:
    # gem install ruby-debug19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.3-preview1
    gem 'ruby-debug19', :platforms => :mri_19
  end
end

group :test do
  gem 'jasmine'
  gem 'capybara',        '~> 1.0.0'
  gem 'database_cleaner'
  gem 'mocha'
  gem 'webmock'

  # gotta wait for QT 4.7
  # gem 'jasmine-headless-webkit'

  platforms :ruby_18 do
    gem 'minitest'
    gem 'minitest_tu_shim'
  end
end
