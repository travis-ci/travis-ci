# -*- coding: utf-8 -*-
require 'spec_helper'
require 'webmock/rspec'

describe RepositoriesController do
  describe "GET 'index'" do
    before(:each) do
      # setup the two repos we need
      FactoryGirl.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
      FactoryGirl.create(:repository, :owner_name => "josh", :name => "globalize", :last_build_started_at => Date.yesterday)
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

    let(:repository) { FactoryGirl.create(:repository, :owner_name => "sven", :name => "travis-ci") }

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
      Factory(:broken_build, :repository => repository, :branch => 'master')
      Factory(:successfull_build, :repository => repository, :branch => 'feature')

      should_receive_file_with_status("stable")

      get(:show, :format => "png", :owner_name => "sven", :name => "travis-ci", :branch => 'feature')
    end

    it 'limits to the provided branch when the attribute is provided' do
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
      travis = FactoryGirl.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
      build_parent = FactoryGirl.create(:build, :repository => travis, :started_at => Time.now, :config => {'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'], 'env' => ['DB=sqlite3', 'DB=postgres']})
      build_parent.matrix.each do |build|
        if build.config['rvm'] == '1.8.7'
          build.update_attribute(:status, 0)
        elsif build.config['rvm'] == '1.9.2'
          build.update_attribute(:status, 1)
        end
      end
    end

    context "with parameter rvm:1.8.7" do
      it "return last build status passing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.8.7"
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 0
      end
    end

    context "with parameter rvm:1.9.2" do
      it "return last build status failing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.9.2"
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 1
      end
    end

    context "with parameters rvm:1.8.7 and gemfile:test/Gemfile.rails-2.3.x" do
      it "return last build status passing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.8.7", :gemfile => "test/Gemfile.rails-2.3.x"
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 0
      end
    end

    context "with parameters rvm:1.9.2 and gemfile:test/Gemfile.rails-3.0.x" do
      it "return last build status failing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.9.2", :gemfile => "test/Gemfile.rails-2.3.x"
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 1
      end
    end

    context "with parameters rvm:1.8.7, gemfile:test/Gemfile.rails-2.3.x, and env:DB=postgres passed" do
      it "return last build status passing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.8.7", :gemfile => "test/Gemfile.rails-2.3.x", :env => 'DB=postgres'
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 0
      end
    end

    context "with parameters rvm:1.9.2, gemfile:test/Gemfile.rails-2.3.x, and env:DB=postgres passed" do
      it "return last build status failing" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :rvm => "1.9.2", :gemfile => "test/Gemfile.rails-2.3.x", :env => 'DB=postgres'
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql 1
      end
    end

    context "with parameters rvm:perl" do
      it "return last build status unknown" do
        get :show, :owner_name => "sven", :name => "travis-ci", :format => "json", :params => {:rvm => "perl"}
        result = ActiveSupport::JSON.decode response.body
        result['last_build_status'].should eql nil
      end
    end

    it "return info about repository in json format" do
      get :show, :owner_name => "sven", :name => "travis-ci", :format => "json"

      result = ActiveSupport::JSON.decode response.body
      %w(id last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at slug status).each do |node_name|
        result.include?(node_name).should be_true
      end
      result['last_build_status'].should eql nil
      result['status'].should eql 'unknown'
      result['slug'].should eql 'sven/travis-ci'
    end
  end

  describe "GET 'show', format xml" do
    before(:each) do
      FactoryGirl.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
    end

    it "return info about repository in xml format" do
      get :show, :owner_name => "sven", :name => "travis-ci", :format => "xml"

      result = ActiveSupport::XmlMini.parse response.body
      %w(id last_build_id last_build_number last_build_status last_build_started_at last_build_finished_at slug status).each do |node_name|
        result['repository'].include?(node_name).should be_true
      end
      result['repository']['last_build_status']['__content__'].should eql nil
      result['repository']['status']['__content__'].should eql 'unknown'
      result['repository']['slug']['__content__'].should eql 'sven/travis-ci'
    end
  end
end
