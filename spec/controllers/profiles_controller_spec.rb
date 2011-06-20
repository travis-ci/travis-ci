require 'spec_helper'
require 'webmock/rspec'

describe ProfilesController do
  include Devise::SignInHelpers

  describe "PUT 'update_service_hook'" do
    before(:each) do
      @user = Factory.create(:user, :github_oauth_token => "myfaketoken")
      sign_in_user @user
    end
    let(:create_repository) { Factory.create(:repository, :name => "travis-ci", :owner_name => "sven")}
    let(:stub_unsubscribe) {
      stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").with(:body => {
        'hub.mode' => "unsubscribe",
        'hub.topic' => CGI.escape("https://github.com/sven/travis-ci/events/push"),
        'hub.callback' => CGI.escape("github://Travis")
      }.collect { |k,v| [ k,v ].join("=") }.join("&")).to_return(:status => 200, :body => "")
    }

    let(:stub_subscribe) {
      stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").with(:body => {
        'hub.mode' => "subscribe",
        'hub.topic' => CGI.escape("https://github.com/sven/travis-ci/events/push"),
        'hub.callback' => CGI.escape("github://Travis?token=#{@user.tokens.first.token}&user=svenfuchs&domain=")
      }.collect { |k,v| [ k,v ].join("=") }.join("&")).to_return(:status => 200, :body => "")
    }

    it "should create repository if it does not exist" do
      stub_subscribe
      put :update_service_hook, :name => "travis-ci", :owner => "sven", :is_active => true

      Repository.count.should eql 1
      Repository.find(:first).is_active.should eql true
      assert_requested :post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1
    end

    it "should update existing repository if it exists" do
      stub_subscribe
      create_repository
      put :update_service_hook, :name => "travis-ci", :owner => "sven", :is_active => true

      Repository.count.should eql 1
      Repository.find(:first).is_active.should eql true
      assert_requested :post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1
    end

    it "should unsubscribe repository from travis-ci service" do
      stub_unsubscribe
      create_repository

      put :update_service_hook, :name => "travis-ci", :owner => "sven", :is_active => false
      Repository.find(:first).is_active.should eql false
      assert_requested :post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1
    end
  end

  describe "GET 'repositories'" do
    before(:each) do
      sign_in_new_user
    end

    it "should return repositories of current user" do
      stub_request(:get, "https://github.com/api/v2/json/repos/show/svenfuchs").to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)
      get :service_hooks, :format => "json"

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
