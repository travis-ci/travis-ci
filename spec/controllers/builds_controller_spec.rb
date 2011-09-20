require 'spec_helper'

describe BuildsController do
  
  before { Scenario.default }
  
  let(:repository) { Repository.first }
  let(:builds) { repository.builds.recent }
  
  describe 'GET :index' do
    it 'returns a list of builds in json' do
      get :index, :repository_id => repository.id, :format => :json
      json_response.should == json_for_http(builds)
    end
  end

  describe 'GET :show' do
    it 'returns build details in json' do
      get :show, :repository_id => repository.id, :id => builds.first.id, :format => :json
      json_response.should == json_for_http(builds.first)
    end
  end
end
