Dir["#{File.expand_path('../**/*_test.rb', __FILE__)}"].each do |test|
  require test
end
