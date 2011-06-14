source :rubygems

gem 'rails',               '~> 3.0.7'
gem 'pg',                  '~> 0.11.0'
gem 'SystemTimer',         '~> 1.2.3', :platforms => ['ruby_18']
gem 'compass',             '~> 0.11.0'
gem 'devise',              '~> 1.3.3'
gem 'hoptoad_notifier',    '~> 2.4.9'
gem 'jammit',              '~> 0.6.0'
gem 'oa-oauth',            '~> 0.2.6', :require => 'omniauth/oauth'
gem 'pusher',              '~> 0.8.0'
gem 'refraction',          '~> 0.2.0'
gem 'unobtrusive_flash',   '~> 0.0.2'
gem 'yajl-ruby',           '~> 0.8.2'
gem 'rake',                '~> 0.9.1'
gem 'silent-postgres',     '~> 0.0.8'
gem 'octokit', :git => 'https://github.com/joshk/octokit.git'
gem 'unicorn',             '~> 3.6.2'
gem 'resque-meta',         '~> 1.0.3'

group :test do
  gem 'database_cleaner'
  gem 'factory_girl', '~> 1.3'
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

  platforms :mri_18 do
    gem 'ruby-debug'
  end

  platforms :mri_19 do
    gem 'ruby-debug19'
  end
  gem 'capybara', '~> 0.4.1.2'
end

group :development, :test do
  gem 'steak', '~> 1.1.0'
  gem 'rspec-rails', '~> 2.6.1'
end
