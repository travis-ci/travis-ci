source :rubygems

gem 'rails',             '~> 3.0.9'
gem 'rake',              '~> 0.9.2'
gem 'pg',                '~> 0.11.0'
gem 'yajl-ruby',         '~> 0.8.2'
gem 'hashr',             '~> 0.0.10'

gem 'compass',           '~> 0.11.3'
gem 'devise',            '~> 1.4.2'
gem 'oa-oauth',          '~> 0.2.6'

gem 'refraction',        '~> 0.2.0'
gem 'unobtrusive_flash', '~> 0.0.2'
gem 'pusher',            '~> 0.8.1'
gem 'octokit',           :git => 'https://github.com/pengwynn/octokit.git', :ref => '463e08caa4f940045f7f'

gem 'silent-postgres',   '~> 0.0.8'
gem 'hoptoad_notifier',  '~> 2.4.11'
gem 'jammit',            '~> 0.6.0'

gem 'unicorn',           '~> 4.0.0', :platform => :ruby
gem 'SystemTimer',       '~> 1.2.3', :platforms => :ruby_18
gem 'clockwork'

gem 'resque',            '~> 1.17.1'
gem 'resque-heartbeat',  :git => 'https://github.com/svenfuchs/resque-heartbeat.git', :ref => 'ba7a89f'
gem 'rabl',              '~> 0.3.0'

gem 'jruby-openssl',     :platforms => :jruby

# gem 'simple_states',     '~> 0.0.4'
gem 'simple_states',     :git => 'https://github.com/svenfuchs/simple_states.git'
gem 'newrelic_rpm',      '~> 3.1.0'

group :test do
  gem 'capybara',        '~> 1.0.0'
  gem 'database_cleaner'
  gem 'factory_girl',    '~> 2.0.3'
  gem 'mocha'
  gem 'fakeredis'
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
    gem "require_relative", "~> 1.0.1"
    gem 'ruby-debug'
  end

  unless RUBY_VERSION == '1.9.3' && RUBY_PLATFORM !~ /darwin/
    # will need to install ruby-debug19 manually:
    # gem install ruby-debug19 -- --with-ruby-include=$rvm_path/src/ruby-1.9.3-preview1
    gem 'ruby-debug19', :platforms => :mri_19
  end
end

