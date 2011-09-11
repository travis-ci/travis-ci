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
gem 'oa-oauth',          '~> 0.2.6'
gem 'simple_states',     '0.0.9'
gem 'unobtrusive_flash', '~> 0.0.2'
gem 'premailer',         '~> 1.7.1'
gem 'nokogiri',          '~> 1.5.0'

# apis
# current oa-oauth release depends on faraday 0.6.1, current octokit on faraday ~> 0.7.3, :git source for oa-oauth confuses heroku :(
# so we have to wait for an oa-oauth release
gem 'octokit',           :git => 'git://github.com/pengwynn/octokit.git', :ref => '463e08caa4f940045f7f'
gem 'pusher',            '~> 0.8.1'
gem 'hoptoad_notifier',  '~> 2.4.11'
gem 'newrelic_rpm',      '~> 3.1.0'

# heroku
gem 'unicorn',           '~> 4.0.0', :platforms => :ruby
gem 'SystemTimer',       '~> 1.2.3', :platforms => :ruby_18
gem 'clockwork'

# assets
group :assets do
  gem 'sass-rails',        '~> 3.1.0'
  gem 'coffee-rails',      '~> 3.1.0'
  gem 'uglifier'
  gem 'compass',           '0.12.alpha.0'
end

group :test do
  gem 'jasmine'
  gem 'capybara',        '~> 1.0.0'
  gem 'database_cleaner'
  gem 'mocha'
  gem 'fakeredis',       '~> 0.2.0'
  gem 'webmock'

  # gotta wait for QT 4.7
  # gem 'jasmine-headless-webkit'

  platforms :ruby_18 do
    gem 'minitest'
    gem 'minitest_tu_shim'
  end
end

group :development, :test do
  gem 'factory_girl',    '~> 2.0.3'
  gem 'forgery', "~> 0.5.0"
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

