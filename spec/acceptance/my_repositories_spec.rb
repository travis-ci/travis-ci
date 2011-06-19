require File.dirname(__FILE__) + '/acceptance_helper'
require 'webmock/rspec'

feature "Feature name", %(
  As a registered user
  I should have my repositories available
) do

  self.extend WebMock::API
  before(:each) do
    stub_request(:get, "https://github.com/api/v2/json/repos/show/nickname").to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)
  end

  before(:all) do
    # It's not clear what exactly capybara have changed so that Rspec includes do not function. But that's not a good approach.
  end
  scenario "my repositories" do
    self.extend HelperMethods
    self.extend OmniauthHelperMethods
    self.extend NavigationHelpers

    mock_omniauth

    visit homepage
    click_link 'Sign in with Github'
    should_see_text 'name'

    visit profile_page
    should_see_text 'safemode'
    should_see_text 'scriptaculous-sortabletree'
  end
end
