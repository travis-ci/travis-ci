require File.dirname(__FILE__) + '/acceptance_helper'
require 'webmock/rspec'

feature "Feature name", %(
  As a registered user
  I should have my repositories available
) do

  self.extend WebMock::API

  scenario "my repositories" do
    stub_request(:get, "https://github.com/api/v2/json/repos/show/nickname").to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)
    mock_omniauth

    visit "/"
    click_link 'Sign in with Github'
    should_see_text 'name'

    click_link 'My repositories'

    should_see_text 'safemode'
    should_see_text 'scriptaculous-sortabletree'
  end
end
