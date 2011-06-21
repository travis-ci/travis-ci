source 'http://rubygems.org'

gem 'rails',             '~> 3.0.9'
gem 'SystemTimer',       '~> 1.2.3', :platforms => :ruby_18
gem 'compass',           '~> 0.11.0'
gem 'devise',            '~> 1.3.3'
gem 'em-http-request',   '~> 0.3.0'
gem 'em-websocket',      '~> 0.3.0'
gem 'hoptoad_notifier',  '~> 2.4.9'
gem 'jammit',            '~> 0.6.0'
gem 'linecache19',       '~> 0.5.12', :platforms => :mri_19
gem 'linecache',         '0.43', :platforms => :mri_18
gem 'oa-oauth',          '0.2.0', :require => 'omniauth/oauth'
gem 'pg',                '~> 0.11.0'
gem 'pusher',            '~> 0.8.0'
gem 'refraction',        '~> 0.2.0'
gem 'resque',            '~> 1.17.0'
gem 'resque-meta',       '~> 1.0.3'
gem 'silent-postgres',   '~> 0.0.8'
gem 'unobtrusive_flash', '~> 0.0.2'
gem 'yajl-ruby',         '~> 0.8.2'

# gem 'rails_admin', :git => 'git://github.com/sferik/rails_admin.git'

gem 'unicorn',             '~> 3.6.2'

group :test do
  gem 'capybara'
  gem 'cucumber-rails'
  gem 'database_cleaner'
  gem 'factory_girl'
  gem 'factory_girl_rails'
  gem 'fakeredis'
  gem 'fakeweb'
  gem 'mocha'
  gem 'test_declarative'
  gem 'web-socket-ruby'

  platforms :ruby_18 do
    gem 'minitest'
    gem 'minitest_tu_shim'
  end

  platforms :mri_18 do
    gem 'ruby-debug'
  end

  platforms :mri_19 do
    gem 'ruby-debug19'
  end
end

group :development, :test do
  gem 'rake'
  gem 'rspec-rails'
  gem 'steak'
end
