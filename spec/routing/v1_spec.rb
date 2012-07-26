require 'spec_helper'

describe 'v1' do
  let(:format)     { :json }
  let(:params)     { { :controller => controller, :action => action, :format => format } }

  describe 'GET to repositories.json' do
    let(:controller) { 'v1/repositories' }
    let(:action) { :index }

    it 'routes to V1::RepositoriesController#index' do
      { :get => 'repositories.json' }.should route_to(params)
    end
  end

  describe 'GET to repositories/1.json' do
    let(:controller) { 'v1/repositories' }
    let(:action) { :show }

    it 'routes to V1::RepositoriesController#show' do
      { :get => 'repositories/1.json' }.should route_to(params.merge(:id => 1))
    end
  end

  describe 'GET to builds.json' do
    let(:controller) { 'v1/builds' }
    let(:action) { :index }

    it 'routes to V1::BuildsController#index' do
      { :get => 'builds.json' }.should route_to(params)
    end
  end

  describe 'GET to builds/1.json' do
    let(:controller) { 'v1/builds' }
    let(:action) { :show }

    it 'routes to V1::BuildsController#show' do
      { :get => 'builds/1.json' }.should route_to(params.merge(:id => 1))
    end
  end

  describe 'GET to branches.json' do
    let(:controller) { 'v1/branches' }
    let(:action) { :index }

    it 'routes to V1::BranchesController#index' do
      { :get => 'branches.json' }.should route_to(params)
    end
  end

  describe 'GET to jobs.json' do
    let(:controller) { 'v1/jobs' }
    let(:action) { :index }

    it 'routes to V1::JobsController#index' do
      { :get => 'jobs.json' }.should route_to(params)
    end
  end

  describe 'GET to jobs/1.json' do
    let(:controller) { 'v1/jobs' }
    let(:action) { :show }

    it 'routes to V1::JobsController#show' do
      { :get => 'jobs/1.json' }.should route_to(params.merge(:id => 1))
    end
  end

  describe 'GET to workers.json' do
    let(:controller) { 'v1/workers' }
    let(:action) { :index }

    it 'routes to V1::WorkersController#index' do
      { :get => 'workers.json' }.should route_to(params)
    end
  end

  describe 'GET to profile/service_hooks.json' do
    let(:controller) { 'v1/service_hooks' }
    let(:action) { :index }

    it 'routes to V1::RepositoriesController#index' do
      { :get => 'profile/service_hooks.json' }.should route_to(params)
    end
  end

  describe 'PUT to profile/service_hooks.json' do
    let(:controller) { 'v1/service_hooks' }
    let(:action) { :update }

    it 'routes to V1::RepositoriesController#update' do
      { :put => 'profile/service_hooks/svenfuchs:minimal' }.should route_to(params.merge(:id => 'svenfuchs:minimal'))
    end
  end

  describe 'GET to :owner_name/:name.json' do
    let(:controller) { 'v1/repositories' }
    let(:action) { :show }

    it 'routes to V1::RepositoriesController#show' do
      { :get => 'owner/name.json' }.should route_to(params.merge(:owner_name => 'owner', :name => 'name'))
    end

    it 'routes to V1::RepositoriesController#show when owner contains dots' do
      { :get => 'some.owner/name.json' }.should route_to(params.merge(:owner_name => 'some.owner', :name => 'name'))
    end

    it 'routes to V1::RepositoriesController#show when repository name contains dots' do
      { :get => 'owner/some.name.json' }.should route_to(params.merge(:owner_name => 'owner', :name => 'some.name'))
    end

    it 'routes to V1::RepositoriesController#show when owner name and repository name contains dots' do
      { :get => 'some.owner/some.name.json' }.should route_to(params.merge(:owner_name => 'some.owner', :name => 'some.name'))
    end
  end

  describe 'GET to :owner_name/:name.png' do
    let(:controller) { 'v1/repositories' }
    let(:action) { :show }
    let(:format) { :png }

    it 'routes to V1::RepositoriesController#show' do
      { :get => 'owner/name.png' }.should route_to(params.merge(:owner_name => 'owner', :name => 'name'))
    end

    it 'routes to V1::RepositoriesController#show when owner contains dots' do
      { :get => 'some.owner/name.png' }.should route_to(params.merge(:owner_name => 'some.owner', :name => 'name'))
    end

    it 'routes to V1::RepositoriesController#show when repository name contains dots' do
      { :get => 'owner/some.name.png' }.should route_to(params.merge(:owner_name => 'owner', :name => 'some.name'))
    end

    it 'routes to V1::RepositoriesController#show when owner name and repository name contains dots' do
      { :get => 'some.owner/some.name.png' }.should route_to(params.merge(:owner_name => 'some.owner', :name => 'some.name'))
    end
  end

  describe 'GET to :owner_name/:name/cc.xml' do
    let(:controller) { 'v1/repositories' }
    let(:action) { :show }
    let(:format) { :xml }

    it 'routes to V1::RepositoriesController#show in XML format with the cctray schema' do
      { :get => 'owner/name/cc.xml' }.should route_to(params.merge(:owner_name => 'owner', :name => 'name', :schema => 'cctray'))
    end

    it 'routes to V1::RepositoriesController#show in XML format with the cctray schema when owner and repository name contains dots' do
      { :get => 'some.owner/some.name/cc.xml' }.should route_to(params.merge(:owner_name => 'some.owner', :name => 'some.name', :schema => 'cctray'))
    end
  end

  describe 'GET to :owner_name/:name/builds.json' do
    let(:controller) { 'v1/builds' }
    let(:action) { :index }

    it 'routes to V1::BuildsController#index' do
      { :get => 'owner/name/builds.json' }.should route_to(params.merge(:owner_name => 'owner', :name => 'name'))
    end
  end

  describe 'GET to :owner_name/:name/builds/:id.json' do
    let(:controller) { 'v1/builds' }
    let(:action) { :show }

    it 'routes to V1::BuildsController#show' do
      { :get => 'owner/name/builds/1.json' }.should route_to(params.merge(:owner_name => 'owner', :name => 'name', :id => 1))
    end
  end
end
