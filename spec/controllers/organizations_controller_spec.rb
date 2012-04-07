require 'spec_helper'

describe OrganizationsController do
  before(:each) do
    sign_in_user user
  end

  let(:user) { Factory(:user, :github_oauth_token => 'github_oauth_token') }

  describe 'GET :index' do
    let!(:organizations) {[
      FactoryGirl.create(:organization, :name => 'org 1', :login => 'org_1'),
      FactoryGirl.create(:organization, :name => 'org 2', :login => 'org_2')
    ]}
    let!(:membership) {
      organizations.map { |o|
        FactoryGirl.create(:membership, :organization => o, :user => user)
      }
    }

    it 'index lists all jobs on the queue' do
      get :index, :format => :json

      json = ActiveSupport::JSON.decode(response.body)
      json.should include({ 'id' => organizations.first.id, 'name' => 'org 1', 'login' => 'org_1' })
      json.should include({ 'id' => organizations.last.id,  'name' => 'org 2', 'login' => 'org_2' })
    end
  end
end
