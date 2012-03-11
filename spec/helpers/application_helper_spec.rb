require 'spec_helper'

describe ApplicationHelper do
  describe 'active_page?' do
    it '#active_page? returns true when the given route matches the current page' do
      def params
        { :controller => "users", :action => "new" }
      end
      active_page?("users#new").should == true
    end

    it '#active_page? returns false when the given route does not matche the current page' do
      def params
        { :controller => "users", :action => "destroy" }
      end
      active_page?("users#new").should == false
    end
  end
  describe 'localization links' do
    describe 'top_bar_menu_item' do
      it 'should not have a hl parameter if it is not in params' do
        l = helper.top_bar_menu_item 'foo', 'bar'
        l.should == '<li><a href="bar">foo</a></li>'
      end
      it 'should have a hl parameter if it is in params' do
        controller.request.query_parameters[:hl] = :en
        l = helper.top_bar_menu_item 'foo', 'bar'
        l.should == '<li><a href="bar?hl=en">foo</a></li>'
      end
    end

    describe 'locale_link_to' do
      it 'should not have a hl parameter if it is not in params' do
        l = helper.locale_link_to 'foo', 'bar'
        l.should == '<a href="bar">foo</a>'
      end
      it 'should have a hl parameter if it is in params' do
        controller.request.query_parameters[:hl] = :en
        l = helper.locale_link_to 'foo', 'bar'
        l.should == '<a href="bar?hl=en">foo</a>'
      end
    end

    describe 'switch_locale_link' do
      it 'should add in the language option to the current path' do
        controller.request.path = 'foo/bar'
        l = helper.switch_locale_link 'foo', :hl => :cn
        l.should == '<a href="foo/bar?hl=cn">foo</a>'
      end
    end

  end
  describe 'gravatar' do
    let(:user) { FactoryGirl.build(:user) }

    it '#gravatar returns an IMG tag for a given user' do
      gravatar(user).should == "<img alt=\"#{user.name}\" class=\"profile-avatar\" src=\"http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=48&amp;d=mm\" />"
    end

    it '#gravatar with a given :size returns an IMG tag with the given :size' do
      gravatar(user, :size => 24).should == "<img alt=\"#{user.name}\" class=\"profile-avatar\" src=\"http://www.gravatar.com/avatar/#{user.profile_image_hash}?s=24&amp;d=mm\" />"
    end
  end
end

