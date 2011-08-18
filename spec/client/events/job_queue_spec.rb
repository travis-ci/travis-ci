require 'client/spec_helper'

feature 'Queueing and dequeuing builds', %(
  As anybody
  I want to see which build tasks are queued
), :js => true do

  # TODO how to make sure these payloads are in sync with the actual app?
  let(:build_queued_event_info) {
    {
      :repository => {
        :id => 2,
        :slug => 'rails/rails'
      },
      :build => {
        :id => 10,
        :number => 4
      }
    }
  }

  scenario 'build gets queued' do
    visit '/'
    dispatch_pusher_command 'jobs', 'build:queued', build_queued_event_info

    should_see_text 'rails/rails', :within => '#jobs'
  end

  scenario 'build is removed from queue' do
    visit '/'

    dispatch_pusher_command 'jobs', 'build:queued', build_queued_event_info
    dispatch_pusher_command 'jobs', 'build:started', build_queued_event_info

    should_see_text 'rails/rails', :within => '#repositories'
    should_not_see_text 'rails/rails', :within => '#jobs'
  end
end
