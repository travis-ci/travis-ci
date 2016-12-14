require 'spec_helper'

describe ApplicationController do
  before(:all) do
    ApplicationController.class_eval do
      def index
        render :text => "dur...."
      end
    end
  end

  describe 'i18n locale' do
    it 'the default locale is en' do
      I18n.default_locale.should == :en
    end
  end

  describe 'set_locale' do
    it 'sets i18n.local to HTTP_ACCEPT_LANGUAGE header when hl query param is not supplied and the locale is supported' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja'
      get :index
      I18n.locale.should == :ja
    end
    it 'sets i18n.local to the default when HTTP_ACCEPT_LANGUAGE is not supported and the hl query param is not supplied' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'nl'
      get :index
      I18n.locale.should == :en
    end

    it 'preferres the hl param over HTTP_ACCEPT_LANGUAGE header' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja'
      get :index, :hl=>:en
      I18n.locale.should == :en
    end

    it 'falls back from hl -> header when param is not supported' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'ja'
      get :index, :hl=>:cn
      I18n.locale.should == :ja
    end

    it 'falls back from hl -> header -> deafult when header and param are not supported' do
      request.env['HTTP_ACCEPT_LANGUAGE'] = 'de'
      get :index, :hl=>:cn
      I18n.locale.should == :en
    end

  end

end
