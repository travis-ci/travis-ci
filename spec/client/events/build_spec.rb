# TODO we currently can't test this because there's no easy way to include all the dependencies?
#
# require 'client/spec_helper'
#
# feature 'Walking through the build process', js: true do
#   before :each do
#     Travis.config.notifications = [:worker, :pusher]
#   end
#
#   scenario 'reloading the page after each event' do
#     reloading_page do
#       build_process!
#     end
#   end
#
#   scenario 'updating through websockets' do
#     sending_websocket_messages do
#       build_process!
#     end
#   end
#
#   def build_process!
#     visit '/'
#
#     ping_from_github!
#     should_see_job 'svenfuchs/gem-release' # TODO should see 'svenfuchs/gem-release *'
#     # should_have_job 'job:configure'
#
#     receive_from_worker! 'job:configure:started'
#     should_not_see_job 'svenfuchs/gem-release'
#
#     receive_from_worker! 'job:configure:finished'
#     should_see_jobs 'svenfuchs/gem-release #1.1', 'svenfuchs/gem-release #1.2'
#     should_have_jobs 'job:test:1', 'job:test:2'
#
#     2.upto(3) do |id|
#       number = "1.#{id - 1}"
#
#       receive_from_worker! 'job:test:started', to: "builds/#{id}"
#       click_link 'Current'
#
#       should_not_see_job "svenfuchs/gem-release #{number}"
#       should_see_selected_repository 'svenfuchs/gem-release', color: 'yellow'
#       should_see_matrix '1.1', '1.2', tab: 'current'
#
#       1.upto(3) do |num|
#         receive_from_worker! "job:test:log:#{num}", to: "builds/#{id}/log"
#       end
#       click_link number
#       should_see_log 'the full log' unless @send_websocket_messages # TODO why the heck do these not get appended to the log elements
#
#       receive_from_worker! 'job:test:finished', to: "builds/#{id}"
#       click_link number
#     end
#
#     should_see_selected_repository 'svenfuchs/gem-release', duration: '1 min', finished_at: 'ago', color: 'green'
#   end
#
#   def reloading_page
#     @reload_page = true
#     yield
#     @reload_page = false
#   end
#
#   def sending_websocket_messages
#     @send_websocket_messages = true
#     yield
#     Travis.config.notifications.clear
#     @send_websocket_messages = false
#   end
#
#   def ping_from_github!(options = { reload_page: false })
#     post 'builds', payload: GITHUB_PAYLOADS['gem-release']
#     after_receive_message!
#   end
#
#   def receive_from_worker!(event, options = { reload_path: false })
#     put options[:to] || 'builds/1', WORKER_PAYLOADS[event] # legacy route. should be jobs/1 in future
#     after_receive_message!
#   end
#
#   def after_receive_message!
#     visit '/' if @reload_page
#     send_websocket_messages! if @send_websocket_messages
#   end
#
#   def send_websocket_messages!
#     pusher.messages.each do |message|
#       dispatch_pusher_command 'jobs', message.first, message.last
#       sleep(0.5)
#     end
#     pusher.messages.clear
#   end
#
#   def should_see_job(*jobs)
#     jobs.each do |job|
#       should_see job, within: '#jobs .queue-builds_common'
#     end
#   end
#   alias :should_see_jobs :should_see_job
#
#   def should_not_see_job(*jobs)
#     jobs.each do |job|
#       should_not_see job, within: '#jobs .queue-builds'
#     end
#   end
#   alias :should_not_see_jobs :should_not_see_job
#
#   def should_have_job(*jobs)
#     jobs.each do |job|
#       QUEUE_PAYLOADS[job].should be_published(queue: 'builds.common', pop: true)
#     end
#   end
#   alias :should_have_jobs :should_have_job
#
#   def should_see_log(log)
#     should_see log, within: '#tab_build.active .log'
#   end
#
#   def should_see_selected_repository(*args)
#     attrs = args.extract_options!
#     color = attrs.delete(:color)
#     attrs.merge!(text: args.pop) unless args.empty?
#
#     attrs.each do |name, value|
#       selector =  '#repositories .repository'
#       selector << ".#{color}" unless color == 'yellow'
#       selector << " .#{name}" unless name == :text
#       should_see value, within: selector
#     end
#   end
#
#   def should_see_matrix(*args)
#     options = args.extract_options!
#     args.each do |number|
#       should_see number, within: "#tab_#{options[:tab]}.active"
#     end
#   end
# end
