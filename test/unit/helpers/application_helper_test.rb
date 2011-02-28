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
end
