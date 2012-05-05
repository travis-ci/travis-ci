require 'spec_helper'

describe BranchesController do

  before { Scenario.default }

  let(:repository) { Repository.first }

  describe 'GET :index' do
    it 'returns a list of builds in json' do
      get :index, :repository_id => repository.id, :format => :json
      json_response.should == json_for_http(repository, :type => 'branches')
    end
  end
end
