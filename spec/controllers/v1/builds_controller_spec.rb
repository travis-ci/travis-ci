require 'spec_helper'

describe V1::BuildsController do
  before { Scenario.default }

  let(:repository) { Repository.first }
  let(:builds) { repository.builds.recent }

  describe 'GET :index' do
    it 'returns a list of builds in json' do
      get :index, :repository_id => repository.id, :format => :json
      json_response.should == json_for_http(builds, :version => 'v1', :type => :builds)
    end
  end

  describe 'GET :show' do

    context 'when called using /builds/:id' do
      it 'returns build details in json' do
        build = builds.first
        get :show, :id => build.id, :format => :json
        json_response.should == json_for_http(build, :version => 'v1')
      end
    end

    context 'when called in a nested repositories call eg. /svenfuchs/i18n/builds/:id' do
      it 'returns build details in json' do
        build = builds.first
        get :show, :repository_id => repository.id, :id => build.id, :format => :json
        json_response.should == json_for_http(build, :version => 'v1')
      end

      # it 'returns 404 with wrong repository id' do
      #   get :show, :repository_id => repository.id + 1, :id => builds.first.id, :format => :json
      #   response.should be_not_found
      # end
    end
  end
end
