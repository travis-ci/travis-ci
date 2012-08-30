# encoding: utf-8
require 'spec_helper'

describe "locales" do
  let(:user) { Factory(:user, synced_at: Time.now, is_syncing: false, github_id: 123) }

  def login(user)
    OmniAuth.config.add_mock(:github, {uid: user.github_id, credentials: {token: '123'}, info: {nickname: "bobexample"}, extra: {raw_info: {gravatar_id: "123"}}})
    visit '/'
    click_link 'Sign in with GitHub'
  end

  describe "updating the locale" do
    before do
      GH.stubs(:[]).returns({})
      login(user)
    end

    it "should allow setting the locale" do
      visit '/profile'
      click_link "Profile"
      within "#tab_profile" do
        click_link "Profile"
      end
      select "Français", from: 'user_locale'
      click_on "Update"
      page.should have_content("Accueil")
    end
  end
end
