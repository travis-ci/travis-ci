require 'test_helper'

class ApplicationHelperTest < ActionView::TestCase
  test '#active_page? returns true when the given route matches the current page' do
    def params
      { :controller => "users", :action => "new" }
    end

    assert_equal true, active_page?("users#new")
  end

  test '#active_page? returns false when the given route does not matche the current page' do
    def params
      { :controller => "users", :action => "destroy" }
    end

    assert_equal false, active_page?("users#new")
  end

  test '#gravatar returns an IMG tag for a given user' do
    user = Factory.build(:user)
    expected = "<img alt=\"#{user.name}\" class=\"profile-avatar\" src=\"http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=48&amp;d=mm\" />"

    assert_equal expected, gravatar(user)
  end

  test '#gravatar with a given :size returns an IMG tag with the given :size' do
    user = Factory.build(:user)
    expected = "<img alt=\"#{user.name}\" class=\"profile-avatar\" src=\"http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=24&amp;d=mm\" />"

    assert_equal expected, gravatar(user, :size => 24)
  end
end
