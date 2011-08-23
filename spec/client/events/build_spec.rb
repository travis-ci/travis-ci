require 'client/spec_helper'

feature 'Walking through the build process', :js => true do
  before :each do
    Travis.config.notifications = [:worker]
  end

  let(:github_payloads) { GITHUB_PAYLOADS }
  let(:queue_payloads)  { QUEUE_PAYLOADS  }
  let(:worker_payloads) { WORKER_PAYLOADS }

  scenario 'reloading the page after each event' do
    # GITHUB PING
    post 'builds', :payload => github_payloads['gem-release']
    visit '/'

    should_see 'svenfuchs/gem-release', :within => '#jobs.queue-builds' # TODO should see 'svenfuchs/gem-release *'
    queue_payloads['task:configure'].should be_queued(:queue => 'builds', :pop => true)

    # TASK CONFIGURE START
    put 'builds/1', worker_payloads['task:configure:started'] # legacy route. should be tasks/1 in future
    visit '/'
    should_not_see 'svenfuchs/gem-release', :within => '#jobs.queue-builds'

    # TASK CONFIGURE FINISH
    put 'builds/1', worker_payloads['task:configure:finished'] # legacy route. should be tasks/1 in future
    visit '/'

    should_see 'svenfuchs/gem-release #1.1', :within => '#jobs.queue-builds'
    queue_payloads['task:test:1'].should be_queued(:queue => 'builds', :pop => true)

    should_see 'svenfuchs/gem-release #1.2', :within => '#jobs.queue-builds'
    queue_payloads['task:test:2'].should be_queued(:queue => 'builds', :pop => true)

    2.upto(3) do |id|
      number = "1.#{id - 1}"
      # TASK TEST START
      put "builds/#{id}", worker_payloads['task:test:started'] # legacy route. should be tasks/1 in future
      visit '/'

      should_not_see "svenfuchs/gem-release #{number}", :within => '#jobs.queue-builds'
      should_see 'gem-release', :within => '#repositories .repository:first-child'
      should_see 'gem-release', :within => '#repositories .repository.selected'
      should_see '1.1', :within => '#tab_current.active'
      should_see '1.2', :within => '#tab_current.active'

      1.upto(3) do |num|
        # TASK TEST LOG
        put "builds/#{id}/log", worker_payloads["task:test:log:#{num}"] # legacy route. should be tasks/1/log in future
      end

      visit '/'
      click_link number
      should_see 'the full log', :within => '#tab_build.active .log'

      # TASK TEST FINISH
      put "builds/#{id}", worker_payloads['task:test:finished'] # legacy route. should be tasks/1 in future
      visit '/'
      click_link number
      should_see 'the full log', :within => '#tab_build.active .log'
    end

    should_see '1 min', :within => '#repositories .repository.selected.green .duration'
    should_see 'ago',   :within => '#repositories .repository.selected.green .finished_at'
  end
end
