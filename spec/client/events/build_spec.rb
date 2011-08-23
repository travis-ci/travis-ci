require 'client/spec_helper'

feature 'Walking through the build process', :js => true do
  before :each do
    Travis.config.notifications = [:worker]
  end

  scenario 'reloading the page after each event' do
    post 'builds', :payload => GITHUB_PAYLOADS['gem-release']
    visit '/'

    should_see 'svenfuchs/gem-release', :within => '#jobs.queue-builds' # TODO should see 'svenfuchs/gem-release *'
    payload = {
      :build      => { :id => 1, :commit => '9854592', :branch => 'master' },
      :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
      :queue      => 'builds'
    }
    payload.should be_queued
    Resque.pop('builds')

    # task:configure:started
    put 'builds/1', WORKER_PAYLOADS['task:configure:started'] # legacy route. should be tasks/1 in future
    visit '/'
    should_not_see 'svenfuchs/gem-release', :within => '#jobs.queue-builds'

    # task:configure:finished
    put 'builds/1', WORKER_PAYLOADS['task:configure:finished'] # legacy route. should be tasks/1 in future
    visit '/'

    should_see 'svenfuchs/gem-release #1.1', :within => '#jobs.queue-builds'
    payload = {
      :build      => { :id => 2, :number => '1.1', :commit => '9854592', :branch => 'master', :config => { :rvm => '1.8.7' } },
      :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
      :queue      => 'builds'
    }
    payload.should be_queued
    Resque.pop('builds')

    should_see 'svenfuchs/gem-release #1.2', :within => '#jobs.queue-builds'
    payload = {
      :build      => { :id => 3, :number => '1.2', :commit => '9854592', :branch => 'master', :config => { :rvm => '1.9.2' } },
      :repository => { :id => 1, :slug => 'svenfuchs/gem-release' },
      :queue      => 'builds'
    }
    payload.should be_queued
    Resque.pop('builds')

    2.upto(3) do |id|
      put "builds/#{id}", WORKER_PAYLOADS['task:test:started'] # legacy route. should be tasks/1 in future
      visit '/'

      should_not_see "svenfuchs/gem-release #1.#{id - 1}", :within => '#jobs.queue-builds'
      should_see 'gem-release', :within => '#repositories .repository:first-child'
      should_see 'gem-release', :within => '#repositories .repository.selected' # TODO how to merge these?
      should_see '1.1', :within => '#tab_current.active'
      should_see '1.2', :within => '#tab_current.active'

      1.upto(3) do |num|
        put "builds/#{id}/log", WORKER_PAYLOADS["task:test:log:#{num}"] # legacy route. should be tasks/1/log in future
      end
      visit '/'
      click_link "1.#{id - 1}"
      should_see 'the full log', :within => '#tab_build.active .log'

      put "builds/#{id}", WORKER_PAYLOADS['task:test:finished'] # legacy route. should be tasks/1 in future
      visit '/'

      click_link "1.#{id - 1}"
      should_see 'the full log', :within => '#tab_build.active .log'
    end

    should_see '1 min', :within => '#repositories .repository.selected.green .duration'
    should_see 'ago',   :within => '#repositories .repository.selected.green .finished_at'
  end
end
