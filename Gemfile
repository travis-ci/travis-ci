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
gem 'resque',              '~> 1.17.0'
gem 'resque-meta',         '~> 1.0.3'
gem 'travis-ci-em-pusher', '~> 0.1.1'
gem 'unobtrusive_flash',   '~> 0.0.2'
gem 'yajl-ruby',           '~> 0.8.2'
gem 'rails_admin', :git => 'git://github.com/sferik/rails_admin.git'
gem 'rake',		   '~> 0.9.0'

group :test do
  gem 'database_cleaner'
  gem 'factory_girl', '~> 2.0.0.beta2'
  gem 'factory_girl_rails', :git => 'https://github.com/thoughtbot/factory_girl_rails.git'
  gem 'mocha'
  gem 'test_declarative'
  gem 'web-socket-ruby'
  gem 'fakeredis'
  gem 'webmock'
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
  gem 'steak', '~> 1.1.0'
  gem 'rspec-rails', '~> 2.6.1'
  gem 'capybara', '~> 0.4.1.2'
end
