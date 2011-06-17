require File.dirname(__FILE__) + '/acceptance_helper'

feature "Builds", %(
  As a non-registered user
  I should see current build processes
) do

  let(:build_queued_event_info) { {
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

  scenario "build gets queued" do
    visit "/"
    dispatch_pusher_command 'jobs', 'build:queued', build_queued_event_info
    should_see_text 'rails/rails'
  end
end
