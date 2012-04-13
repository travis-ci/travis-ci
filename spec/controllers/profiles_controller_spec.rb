require 'spec_helper'

describe ProfilesController do
  let(:user) { Factory(:user) }

  before(:each) do
    sign_in_user user
  end

  describe 'GET :show' do
    it 'renders the profile html page' do
      get :show
      response.should be_success
      response.should render_template("profiles/show")
    end
  end

  describe 'POST :update' do

    it 'updates the locale for the user profile' do
      post :update, :user=>{:locale => :ja}
      I18n.locale.should == :ja
      controller.current_user.locale.should == "ja"
      session[:locale].should == :ja
      response.should redirect_to :profile
    end

  end

end
