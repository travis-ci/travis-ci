task 'travis:config' do
  Travis::Builder.init
end

task 'resque:setup' => 'travis:config'
