require File.dirname(__FILE__) + '/acceptance_helper'


feature "Feature name", %q{
  As a non-registered user
  I should see current build processes
} do

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
    page.evaluate_script("trigger('jobs', 'build:queued', '#{build_queued_event_info.to_json}' )")

    wait_until do
      find :xpath, "//*[contains(text(), 'rails/rails')]"
    end
  end
end
