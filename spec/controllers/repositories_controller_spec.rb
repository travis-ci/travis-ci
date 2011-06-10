require 'spec_helper'
require 'webmock/rspec'
describe RepositoriesController do

  describe "GET 'index'" do
    before(:each) do
      @repositories = [
        Factory.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today),
        Factory.create(:repository, :owner_name => "josh", :name => "globalize", :last_build_started_at => Date.yesterday)]
    end

    it "should return list of repositories in json format, ordered by last build started date" do
      get :index

      response.should be_success
      result = JSON.parse response.body
      result.count.should eql 2
      result.first["slug"].should eql "sven/travis-ci"
      result.second["slug"].should eql "josh/globalize"
    end

    it "should return list of repositories in json format, filtered by owner name" do
      get :index, :owner_name => "sven"
      response.should be_success
      result = JSON.parse response.body
      result.count.should eql 1
      result.first["slug"].should eql "sven/travis-ci"
    end
  end

  describe "GET 'my'" do
    before(:each) do
      @request.env["devise.mapping"] = Devise.mappings[:user]
      @user = Factory.create(:user)
      sign_in @user
    end

    it "should return repositories of current user" do
      stub_request(:get, "https://github.com/api/v2/json/repos/show/svenfuchs").to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)
      get :my, :format => "json"

      response.should be_success
      result = JSON.parse response.body
      ## FIXME: probably it makes sense to verify these things agains a complete json, even though we care most about these fields
      result.first["name"].should eql "safemode"
      result.first["owner"].should eql "svenfuchs"
      result.second["name"].should eql "scriptaculous-sortabletree"
      result.second["owner"].should eql "svenfuchs"
    end
  end

  describe "GET 'show'" do
    before(:each) do
      controller.stub!(:render)
    end

    let(:repository) { Factory.create(:repository, :owner_name => "sven", :name => "fuchs") }

    it 'should show an "unknown" button when the repository does not exist' do
      controller.should_receive(:send_file).with("#{Rails.public_path}/images/status/unknown.png", {:type=>"image/png", :disposition=>"inline"}).once

      post :show, :format => "png", :owner_name => "sven", :name => "fuchs"
    end

    it 'should how an "unknown" button when it only has a build thats not finished' do
      Factory(:running_build)

      controller.should_receive(:send_file).with("#{Rails.public_path}/images/status/unknown.png", {:type=>"image/png", :disposition=>"inline"}).once

      post :show, :format => "png", :owner_name => "sven", :name => "fuchs"
    end

    it 'should show an "unstable" button when the repository has broken build' do
      Factory(:broken_build, :repository => repository)

      controller.should_receive(:send_file).with("#{Rails.public_path}/images/status/unstable.png", {:type=>"image/png", :disposition=>"inline"}).once

      post :show, :format => "png", :owner_name => "sven", :name => "fuchs"
    end

    it 'should show a "stable" button when the repository\'s last build passed' do
      Factory(:successfull_build, :repository => repository)

      controller.should_receive(:send_file).with("#{Rails.public_path}/images/status/stable.png", {:type=>"image/png", :disposition=>"inline"}).once

      post :show, :format => "png", :owner_name => "sven", :name => "fuchs"
    end

    it 'should show a "stable" button when the previous build passed and there\'s one still running' do
      Factory(:successfull_build, :repository => repository)
      Factory(:running_build, :repository => repository)

      controller.should_receive(:send_file).with("#{Rails.public_path}/images/status/stable.png", {:type=>"image/png", :disposition=>"inline"}).once

      post :show, :format => "png", :owner_name => "sven", :name => "fuchs"
    end
  end
end
