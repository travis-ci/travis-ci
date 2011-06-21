require 'spec_helper'
require 'webmock/rspec'

describe ProfilesController do
  include Devise::SignInHelpers

  before(:each) do
    Token.any_instance.stub(:token).and_return('afaketoken')
    sign_in_user user
  end

  let(:user)       { Factory(:user, :github_oauth_token => "myfaketoken") }
  let(:repository) { Factory(:repository, :name => "minimal", :owner_name => "svenfuchs") }

  describe "PUT 'update_service_hook'" do
    context "subscribes to Travis-CI service hook" do
      before(:each) do
        hub_body = [
          "hub.topic=#{CGI.escape("https://github.com/svenfuchs/minimal/events/push")}",
          "hub.callback=#{CGI.escape("github://Travis?user=svenfuchs&token=afaketoken&domain=")}",
          "hub.mode=subscribe"
        ].join("&")

        stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").
          with(:body => hub_body).
          to_return(:status => 200, :body => "")
      end

      it "creates repository if it does not exist" do
        put(:update_service_hook, :name => "minimal", :owner => "svenfuchs", :is_active => true)

        Repository.count.should eql(1)
        Repository.first.is_active?.should eql(true)

        assert_requested(:post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1)
      end

      it "updates existing repository if it exists" do
        repository # make sure the repo has been created

        put(:update_service_hook, :name => "minimal", :owner => "svenfuchs", :is_active => true)

        Repository.count.should eql(1)
        Repository.first.is_active?.should eql(true)

        assert_requested(:post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1)
      end
    end

    context "unsubscribes from the Travis-CI service hook" do
      before(:each) do
        hub_body = {
          'hub.mode' => "unsubscribe",
          'hub.topic' => CGI.escape("https://github.com/svenfuchs/minimal/events/push"),
          'hub.callback' => CGI.escape("github://Travis")
        }.collect { |k,v| [ k,v ].join("=") }.join("&")

        stub_request(:post, "https://api.github.com/hub?access_token=myfaketoken").
          with(:body => hub_body).
          to_return(:status => 200, :body => "")
      end

      it "updates existing repository" do
        repository # make sure the repo has been created

        put(:update_service_hook, :name => "minimal", :owner => "svenfuchs", :is_active => false)

        Repository.first.is_active?.should eql(false)

        assert_requested(:post, "https://api.github.com/hub?access_token=myfaketoken", :times => 1)
      end
    end
  end

  describe "GET 'repositories'" do
    it "should return repositories of current user" do
      stub_request(:get, "https://github.com/api/v2/json/repos/show/svenfuchs").
        to_return(:status => 200, :body => File.open("./spec/fixtures/github_user_repos.json").read)

      get(:service_hooks, :format => "json")

      response.should be_success

      ## FIXME: probably it makes sense to verify these things agains a complete json, even though we care most about these fields
      result = ActiveSupport::JSON.decode response.body

      result.first["name"].should   eql("safemode")
      result.first["owner"].should  eql("svenfuchs")
      result.second["name"].should  eql("scriptaculous-sortabletree")
      result.second["owner"].should eql("svenfuchs")
    end
  end

end