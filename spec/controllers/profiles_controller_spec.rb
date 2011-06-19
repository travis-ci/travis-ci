require 'spec_helper'
require 'webmock/rspec'

describe ProfilesController do
  include Devise::SignInHelpers

  describe "DELETE 'remove_service_hook'" do
    before(:each) do
      @user = Factory.create(:user, :github_oauth_token => "myfaketoken")
      sign_in_user @user

      stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").with(:body => {
        'hub.mode' => "unsubscribe",
        'hub.topic' => CGI.escape("https://github.com/sven/travis-ci/events/push"),
        'hub.callback' => CGI.escape("github://Travis")
      }.collect { |k,v| [ k,v ].join("=") }.join("&")).to_return(:status => 200, :body => "")
    end

    let(:repository) { Factory.create(:repository, :name => "travis-ci", :owner_name => "sven")}

    it "should be success" do
      delete :remove_service_hook, :name => "travis-ci", :owner => "sven", :id => repository.id, :is_active => true
      response.should be_success
    end

    it "should be success" do
      delete :remove_service_hook, :name => "travis-ci", :owner => "sven", :id => repository.id, :is_active => true
      response.should be_success
    end

    it "should unsubscribe repository to travis-ci service" do
      delete :remove_service_hook, :name => "travis-ci", :owner => "sven", :id => repository.id, :is_active => false
      Repository.find(:first).is_active.should eql false
      assert_requested :post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1
    end
  end

  describe "POST 'add_service_hook'" do
    before(:each) do
      @user = Factory.create(:user, :github_oauth_token => "myfaketoken")
      sign_in_user @user
      stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").to_return(:status => 200, :body => "")
    end

    it "should be success" do
      post :add_service_hook, :name => "travis-ci", :owner => "sven"
      response.should be_success
    end

    it "should mark repository as active in casse of existing record" do
      Factory.create(:repository, :name => "travis-ci", :owner_name => "sven")
      post :add_service_hook, :name => "travis-ci", :owner => "sven"

      Repository.all.count.should eql 1
      repository = Repository.all.first
      repository.owner_name.should eql "sven"
      repository.name.should eql "travis-ci"
      repository.is_active.should be_true
    end

    it "should create a repository record in database" do
      post :add_service_hook, :name => "travis-ci", :owner => "sven"

      Repository.all.count.should eql 1
      repository = Repository.all.first
      repository.owner_name.should eql "sven"
      repository.name.should eql "travis-ci"
      repository.is_active.should be_true
    end

    it "should redirect when used is not signed in" do
      sign_out @user
      post :add_service_hook, :name => "travis-ci", :owner => "sven"

      response.should be_redirect
    end

    it "should send request to Github pubsub" do
      post :add_service_hook, :name => "travis-ci", :owner => "sven"

      assert_requested :post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1
    end
  end

  describe "GET 'repositories'" do
    before(:each) do
      sign_in_new_user
    end

    it "should return repositories of current user" do
      stub_request(:get, "https://github.com/api/v2/json/repos/show/svenfuchs").to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)
      get :repositories, :format => "json"

      response.should be_success

      ## FIXME: probably it makes sense to verify these things agains a complete json, even though we care most about these fields
      result = ActiveSupport::JSON.decode response.body

      result.first["name"].should eql "safemode"
      result.first["owner"].should eql "svenfuchs"
      result.second["name"].should eql "scriptaculous-sortabletree"
      result.second["owner"].should eql "svenfuchs"
    end
  end

end
