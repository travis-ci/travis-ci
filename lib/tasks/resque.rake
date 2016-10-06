task 'travis:config' do
  require File.dirname(__FILE__) + '/../travis'
  Travis::Builder.init
end

task 'resque:setup' => 'travis:config'
