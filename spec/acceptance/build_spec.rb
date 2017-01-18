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

    with_scope "#jobs" do
      should_see_text 'rails/rails'
    end
  end

  scenario "build is removed from queue" do
    visit "/"

    dispatch_pusher_command 'jobs', 'build:queued', build_queued_event_info
    dispatch_pusher_command 'jobs', 'build:started', build_queued_event_info

    with_scope "#repositories" do
      should_see_text "rails/rails"
    end

    with_scope "#jobs" do
      should_not_see_text 'rails/rails'
    end
  end
end
