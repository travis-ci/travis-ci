require 'spec_helper'

describe "/owner/repository.xml" do
  
  it "routes to RepositoriesController#show when owner or repository name doesn't contain dots" do
    { :get => "/owner/repository.xml" }.
      should route_to(
        :controller => "repositories",
        :action     => "show",
        :owner_name => "owner",
        :name       => "repository",
        :format     => "xml"
      )
  end
  
  it "routes to RepositoriesController#show when owner contains dots" do
    { :get => "/some.owner/repository.xml" }.
      should route_to(
        :controller => "repositories",
        :action     => "show",
        :owner_name => "some.owner",
        :name       => "repository",
        :format     => "xml"
      )
  end
  
  it "routes to RepositoriesController#show when repository name contains dots" do
    { :get => "/owner/some.repository.xml" }.
      should route_to(
        :controller => "repositories",
        :action     => "show",
        :owner_name => "owner",
        :name       => "some.repository",
        :format     => "xml"
      )
  end
  
  it "routes to RepositoriesController#show when owner name and repository name contains dots" do
    { :get => "/some.owner/some.repository.xml" }.
      should route_to(
        :controller => "repositories",
        :action     => "show",
        :owner_name => "some.owner",
        :name       => "some.repository",
        :format     => "xml"
      )
  end
  
end
