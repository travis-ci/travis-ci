require 'client/spec_helper'
require 'webmock/rspec'

feature 'Service hooks', %(
  As a registered user
  I want to review my repositories and easily turn service hooks on and off
) do
  scenario 'my repositories', :js => true, :webmock => true do
    mock_omniauth

    visit homepage
    click_link 'Sign in with Github'
    should_see_text 'name'

    visit profile_page
    should_see_text 'safemode'
    should_see_text 'scriptaculous-sortabletree'

    # TODO turn service hooks on/off
  end
end
