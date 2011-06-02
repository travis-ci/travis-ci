require File.dirname(__FILE__) + '/acceptance_helper'


feature "Feature name", %(
  As a non-registered user
  I should see current build processes
) do

  scenario "build gets queued" do
    visit "/"
    Pusher['jobs'].trigger('build:queued', {"build" => {"id"=>9, "number"=>1}, "repository"=>{"id"=>3, :slug=>"rails/rails`" }})
    wait_until do
      find :xpath, "//*[contains(text(), 'rails/rails')]"
    end
  end
end
