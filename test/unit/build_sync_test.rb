# require 'test_helper_rails'
# 
# class BuildSyncTest < ActiveSupport::TestCase
#   attr_reader :build
# 
#   def setup
#     @build = Factory(:build).reload
#     super
#   end
# 
#   test 'when a build is started Pusher receives a build:started message' do
#     now = Time.now.utc
#     build.update_attributes(:started_at => now)
# 
#     expected = ['build:started', {
#       'build' => build.as_json(:for => :'build:started'),
#       'repository' => build.repository.as_json(:for => :'build:started')
#     }]
#     assert_equal expected, Travis.pusher.messages.last
#   end
# 
#   test 'when characters are appended to the build log Pusher receives a build:log message' do
#     now = Time.now.utc
#     build.append_log!('some characters')
# 
#     expected = ['build:log', {
#       'build' => build.as_json(:for => :'build:log'),
#       'repository' => build.repository.as_json(:for => :'build:log'),
#       'log' => 'some characters'
#     }]
#     assert_equal expected, Travis.pusher.messages.last
#   end
# 
#   test 'when a build is finished Pusher receives a build:finished message' do
#     now = Time.now.utc
#     build.update_attributes(:started_at => now)
#     build.update_attributes(:status => 1, :log => 'the build log', :finished_at => now)
# 
#     expected = ['build:finished', {
#       'build' => build.as_json(:for => :'build:finished'),
#       'repository' => build.repository.as_json(:for => :'build:finished')
#     }]
#     assert_equal expected, Travis.pusher.messages.last
#   end
# end
