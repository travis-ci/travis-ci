require 'client/spec_helper'

feature 'Walking through the build process', :js => true do
  before :each do
    Travis.config.notifications = [:worker]
  end

  scenario 'reloading the page after each event' do
    post 'builds', :payload => GITHUB_PAYLOADS['gem-release']
    visit '/'

    payload = {
      :build => { :id => 1, :commit => '9854592', :branch => 'master' },
      :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
      :queue => 'builds'
    }
    payload.should be_queued
    should_see 'svenfuchs/gem-release', :within => '#jobs.queue-builds' # TODO should be 'svenfuchs/gem-release *'

    Resque.pop('builds')
    # post a task:configure:started message
    # visit '/'
    # should not see the configure task in the jobs list
    #
    # post a task:configure:finished message with the config
    # visit '/'
    # should see the test task in the jobs list
    #
    # pop it off the queue and inspect it (we can't do that with capybara, right. can we somehow use drb?)
    #
    # post a task:test:started message
    # visit '/'
    # should not see the test task in the job list
    # repository should be at the top of the repositories list and show the started build (yellow, started_at)
    # current tab should be active and show the current build matrix
    #
    # visit '#![repository/slug]/builds'
    # builds tab should be active and show the current build listed
    #
    # visit '#![repository/slug]/build/[id]'
    # builds tab should be active and show the current build
    #
    # post a task:test:log message with a log update
    # visit '/'
    # should show the updated log
    #
    # post a task:test:finished message with the result and full log
    # visit '/'
    # repositories list should show the finished build (green, finished_at, duration)
    # current tab should show the finished build (green, finished_at, duration, full log)
  end
end
