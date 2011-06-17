source :rubygems

gem 'rails',                '~> 3.0.7'
gem 'rake',                 '~> 0.9.1'
gem 'pg',                   '~> 0.11.0'
gem 'yajl-ruby',            '~> 0.8.2'

gem 'compass',              '~> 0.11.0'
gem 'devise',               '~> 1.3.3'
gem 'oa-oauth',             '~> 0.2.6', :require => 'omniauth/oauth'

gem 'refraction',           '~> 0.2.0'
gem 'unobtrusive_flash',    '~> 0.0.2'
gem 'pusher',               '~> 0.8.0'
gem 'octokit',              :git => 'https://github.com/pengwynn/octokit.git'

gem 'silent-postgres',      '~> 0.0.8'
gem 'hoptoad_notifier',     '~> 2.4.9'
gem 'jammit',               '~> 0.6.0'

gem 'unicorn',              '~> 3.6.2'
gem 'SystemTimer',          '~> 1.2.3', :platforms => :ruby_18
gem 'clockwork'

gem 'resque',               '~> 1.17.0'
gem 'resque-heartbeat',     :git => 'https://github.com/svenfuchs/resque-heartbeat.git'

gem 'newrelic_rpm',         '~> 3.1.0'

group :test do
  gem 'capybara', '~> 0.4.1.2'
  gem 'cucumber-rails'
  gem 'database_cleaner'
  gem 'factory_girl',       '~> 1.3'
  gem 'factory_girl_rails'
  gem 'mocha'
  gem 'test_declarative'
  gem 'web-socket-ruby'
  gem 'fakeredis'
  gem 'webmock'

  platforms :ruby_18 do
    gem 'minitest'
    gem 'minitest_tu_shim'
  end

  gem 'ruby-debug',   :platforms => :mri_18
  gem 'ruby-debug19', :platforms => :mri_19
end

group :development, :test do
  gem 'steak',        '~> 1.1.0'
  gem 'rspec-rails',  '~> 2.6.1'
end
