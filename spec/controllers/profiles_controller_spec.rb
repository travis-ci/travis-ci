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
end
