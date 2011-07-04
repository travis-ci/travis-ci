# -*- coding: utf-8 -*-
require 'spec_helper'
require 'webmock/rspec'

describe RepositoriesController do
  describe "GET 'index'" do
    before(:each) do
      # setup the two repos we need
      Factory.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
      Factory.create(:repository, :owner_name => "josh", :name => "globalize", :last_build_started_at => Date.yesterday)
    end

    context "returns a list of repositories in xml format" do
      it "ordered by last build started date" do
        get(:index, :format => :xml)

        response.should be_success

        result = ActiveSupport::XmlMini.parse response.body
        repository_nodes = result["repositories"]["repository"]
        repository_nodes.count.should eql(2)
        repository_nodes.first["slug"]["__content__"].should  eql("sven/travis-ci")
        repository_nodes.second["slug"]["__content__"].should eql("josh/globalize")
      end

      it "filtered by owner name" do
        get(:index, :owner_name => "sven", :format => :xml)

        response.should be_success
        result = ActiveSupport::XmlMini.parse response.body
        repository_node = result["repositories"]["repository"]
        repository_node["slug"]["__content__"].should eql("sven/travis-ci")
      end
    end

    context "returns a list of repositories in json format" do
      it "ordered by last build started date" do
        get(:index, :format => :json)

        response.should be_success

        result = ActiveSupport::JSON.decode response.body

        result.count.should eql(2)
        result.first["slug"].should  eql("sven/travis-ci")
        result.second["slug"].should eql("josh/globalize")
      end

      it "filtered by owner name" do
        get(:index, :owner_name => "sven", :format => :json)

        response.should be_success

        result = ActiveSupport::JSON.decode response.body

        result.count.should eql(1)
        result.first["slug"].should eql("sven/travis-ci")
      end
    end
  end

  describe "GET 'show', format png" do
    before(:each) do
      controller.stub!(:render)
    end

    let(:repository) { Factory.create(:repository, :owner_name => "sven", :name => "travis-ci") }

    it 'shows an "unknown" button when the repository does not exist' do
      repository
      should_receive_file_with_status("unknown")

      get(:show, :format => "png", :owner_name => "sven", :name => "shmavis-ci")
    end

    it 'shows an "unknown" button when it only has a build thats not finished' do
      Factory(:running_build, :repository => repository)

      should_receive_file_with_status("unknown")

      get(:show, :format => "png", :owner_name => "sven", :name => "travis-ci")
    end

    it 'shows an "unstable" button when the repository has broken build' do
      Factory(:broken_build, :repository => repository)

      should_receive_file_with_status("unstable")

      get(:show, :format => "png", :owner_name => "sven", :name => "travis-ci")
    end

    it 'shows a "stable" button when the repository\'s last build passed' do
      Factory(:successfull_build, :repository => repository)

      should_receive_file_with_status("stable")

      get(:show, :format => "png", :owner_name => "sven", :name => "travis-ci")
    end

    it 'shows a "stable" button when the previous build passed and there\'s one still running' do
      Factory(:successfull_build, :repository => repository)
      Factory(:running_build, :repository => repository)

      should_receive_file_with_status("stable")

      get(:show, :format => "png", :owner_name => "sven", :name => "travis-ci")
    end

    def should_receive_file_with_status(status)
      controller.should_receive(:send_file).
        with("#{Rails.public_path}/images/status/#{status}.png", { :type=>"image/png", :disposition=>"inline" }).
        once
    end
  end

  describe "GET 'show', format json" do
    before(:each) do
      Factory.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
    end
    it "" do
      get :show, :owner_name => "sven", :name => "travis-ci", :format => "json"

      result = ActiveSupport::JSON.decode response.body
      %w(id last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at slug status).each do |node_name|
        result.include?(node_name).should be_true
      end
      result['status'].should eql 'unknown'
      result['slug'].should eql 'sven/travis-ci'
    end
  end

  describe "GET 'show', format xml" do
    before(:each) do
      Factory.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
    end

    it "return info about repository in xml format" do
      get :show, :owner_name => "sven", :name => "travis-ci", :format => "xml"

      result = ActiveSupport::XmlMini.parse response.body
      %w(id last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at slug status).each do |node_name|
        result['repository'].include?(node_name).should be_true
      end
      result['repository']['status']['__content__'].should eql 'unknown'
      result['repository']['slug']['__content__'].should eql 'sven/travis-ci'
    end
  end
end

