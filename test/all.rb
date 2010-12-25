dir = File.dirname(__FILE__) + '/'
Dir["#{dir}**/*_test.rb"].each { |path| require path.sub(dir, '') unless path.include?('backup') }
