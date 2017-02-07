require 'client/spec_helper'
require 'webmock/rspec'

feature 'Feature name', %(
  As a registered user
  I want to review my repositories and easily turn service hooks on and off
) do

  self.extend WebMock::API
  before(:each) do
    url  = 'https://github.com/api/v2/json/repos/show/nickname'
    body = File.open('./spec/fixtures/github/api/v2/json/repos/show/svenfuchs.json').read
    stub_request(:get, url).to_return(:status => 200, :body => body)
  end

  before(:all) do
    # It's not clear what exactly capybara have changed so that Rspec includes do not function. But that's not a good approach.
  end

  scenario 'my repositories', :js => true do
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
