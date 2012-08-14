require 'spec_helper'

describe ProfilesController do
  let(:user) { Factory(:user, :synced_at => Time.now) }

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
      post :update, :user => { :locale => :ja }
      I18n.locale.should == :ja
      controller.current_user.locale.should == "ja"
      session[:locale].should == :ja
      response.should redirect_to :profile
    end
  end

  describe 'POST :sync' do
    let(:publisher) { stub('publisher', :publish => true) }

    before :each do
      Travis::Amqp::Publisher.stubs(:new).returns(publisher)
    end

    describe 'given the current user is not being synced' do
      before :each do
        user.update_column(:is_syncing, false)
      end

      it 'schedules a sync job' do
        publisher.expects(:publish).with({ user_id: user.id }, type: 'sync')
        post :sync
      end

      it 'sets the current user to being synced' do
        post :sync
        user.reload.is_syncing.should be_true
      end
    end

    describe 'given the current user is being synced' do
      before :each do
        user.update_column(:is_syncing, true)
      end

      it 'does not schedule a sync job' do
        publisher.expects(:publish).never
        post :sync
      end

      it 'does not set the current user to being synced' do
        user.expects(:update_column).never
        post :sync
      end
    end
  end
end
