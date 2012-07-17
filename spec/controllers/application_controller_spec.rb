require 'spec_helper'

describe HomeController do # using HomeController because nothing routes to ApplicationController
  let(:user) { Factory(:user) }

  before(:all) do
    HomeController.class_eval do
      def index
        render text: "dur...."
      end
    end
  end

  describe 'i18n locale' do
    it 'the default locale is en' do
      I18n.default_locale.should == :en
    end
  end

  describe 'set_locale' do
    it 'prefers hl query parameter over anything else' do
      sign_in user
      controller.current_user.locale = :es
      session[:locale] = :pl
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'es'
      get :index, hl: :ja
      I18n.locale.should == :ja
    end

    it 'prefers the session[:locale] if there is no hl parameter' do
      sign_in user
      controller.current_user.locale = :es
      session[:locale] = :fr
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja'
      get :index
      I18n.locale.should == :fr
    end


    it 'prefers current_user.locale if session[:locale] is empty and there is no hl query paramter' do
      sign_in user
      controller.current_user.locale = :es
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja'
      get :index
      I18n.locale.should == :es
    end

    it 'prefers the http_accept_language if session[locale] is empty, there is no hl query parameter and no current_user.local' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja, en'
      get :index
      I18n.locale.should == :ja
    end

    it 'uses the default locale when nothing is specified' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = nil
      get :index
      I18n.locale.should == I18n.default_locale
    end
  end
end
