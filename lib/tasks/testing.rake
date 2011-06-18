# fix for rake, test_unit and 1.9.3
#
# ugly hax but at least tests can now run on ruby-head
#
# https://github.com/jimweirich/rake/issues/51
# http://blog.jayfields.com/2008/02/rake-task-overwriting.html

require 'rake/testtask'

class Rake::Task
  def abandon
    @actions.clear
  end
end

namespace :test do

  Rake::Task[:units].abandon
  Rake::Task[:functionals].abandon
  Rake::Task[:integration].abandon

  TestTaskWithoutDescription.new(:units => "test:prepare") do |t|
    t.libs << "test"
    t.test_files = Dir.glob("test/unit/**/*_test.rb")
  end

  TestTaskWithoutDescription.new(:functionals => "test:prepare") do |t|
    t.libs << "test"
    t.test_files = Dir.glob("test/functional/**/*_test.rb")
  end

  TestTaskWithoutDescription.new(:integration => "test:prepare") do |t|
    t.libs << "test"
    t.test_files = Dir.glob("test/integration/**/*_test.rb")
  end

end
