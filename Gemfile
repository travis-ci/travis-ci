source 'http://rubygems.org'

gem 'rails',               '~> 3.0.7'
gem 'pg',                  '~> 0.11.0'
gem 'SystemTimer',         '~> 1.2.3', :platforms => ['ruby_18']
gem 'compass',             '~> 0.11.0'
gem 'devise',              '~> 1.3.3'
gem 'em-http-request',     '~> 0.3.0'
gem 'em-websocket',        '~> 0.3.0'
gem 'hoptoad_notifier',    '~> 2.4.9'
gem 'jammit',              '~> 0.6.0'
gem 'oa-oauth',             '= 0.2.0', :require => 'omniauth/oauth'
gem 'pusher',              '~> 0.8.0'
gem 'refraction',          '~> 0.2.0'
gem 'resque',              '~> 1.15.0'
gem 'resque-meta',         '~> 1.0.3'
gem 'travis-ci-em-pusher', '~> 0.1.1'
gem 'unobtrusive_flash',   '~> 0.0.2'
gem 'yajl-ruby',           '~> 0.8.2'

gem 'rails_admin', :git => 'git://github.com/sferik/rails_admin.git', :ref => 'b9c50a44a1e21840b265'

group :test do
  gem 'capybara'
  gem 'cucumber-rails'
  gem 'database_cleaner'
  gem 'factory_girl_rails', :git => 'git://github.com/thoughtbot/factory_girl_rails.git'
  gem 'fakeweb'
  gem 'mocha'
  gem 'test_declarative'
  gem 'web-socket-ruby'
  gem 'fakeredis'
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
