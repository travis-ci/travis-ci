require 'spec_helper'

describe BranchesController do
  describe 'GET :index returns a list of active branches' do
    before { Scenario.default }

    let(:repository) { Repository.first }

    context 'in json' do
      it 'with current build status' do
        get :index, :repository_id => repository.id, :format => :json

        response.should be_success
        json_response.should == json_for_http(repository.last_finished_builds_by_branches)
      end
    end
  end
end
