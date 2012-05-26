require 'spec_helper'

describe 'v1' do
  describe '/owner/repository.xml' do
    let(:expected) { { :controller => 'v1/repositories', :action => 'show', :format => 'xml' } }

    it 'routes to RepositoriesController#show when owner or repository name does not contain dots' do
      { :get => '/owner/name.xml' }.should route_to(expected.merge(:owner_name => 'owner', :name => 'name'))
    end

    it 'routes to RepositoriesController#show when owner contains dots' do
      { :get => '/some.owner/name.xml' }.should route_to(expected.merge(:owner_name => 'some.owner', :name => 'name'))
    end

    it 'routes to RepositoriesController#show when repository name contains dots' do
      { :get => '/owner/some.name.xml' }.should route_to(expected.merge(:owner_name => 'owner', :name => 'some.name'))
    end

    it 'routes to RepositoriesController#show when owner name and repository name contains dots' do
      { :get => '/some.owner/some.name.xml' }.should route_to(expected.merge(:owner_name => 'some.owner', :name => 'some.name'))
    end
  end

  describe '/owner/repository/cc.xml' do
    let(:expected) { { :controller => 'v1/repositories', :action => 'show', :format => 'xml', :schema => 'cctray' } }

    it 'routes to RepositoriesController#show in XML format with the cctray schema' do
      { :get => '/owner/name/cc.xml' }.should route_to(expected.merge(:owner_name => 'owner', :name => 'name'))
    end

    it 'routes to RepositoriesController#show in XML format with the cctray schema when owner and repository name contains dots' do
      { :get => '/some.owner/some.name/cc.xml' }.should route_to(expected.merge(:owner_name => 'some.owner', :name => 'some.name'))
    end
  end
end
