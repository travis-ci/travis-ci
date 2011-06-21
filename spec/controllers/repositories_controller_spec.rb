require 'spec_helper'
require 'webmock/rspec'

describe RepositoriesController do

  describe "GET 'index'" do
    before(:each) do
      # setup the two repos we need
      Factory.create(:repository, :owner_name => "sven", :name => "travis-ci", :last_build_started_at => Date.today)
      Factory.create(:repository, :owner_name => "josh", :name => "globalize", :last_build_started_at => Date.yesterday)
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

  describe "GET 'show'" do
    before(:each) do
      controller.stub!(:render)
    end

    let(:repository) { Factory.create(:repository, :owner_name => "sven", :name => "fuchs") }

    it 'shows an "unknown" button when the repository does not exist' do
      should_receive_file_with_status("unknown")

      post(:show, :format => "png", :owner_name => "sven", :name => "fuchs")
    end

    it 'shows an "unknown" button when it only has a build thats not finished' do
      Factory(:running_build)

      should_receive_file_with_status("unknown")

      post(:show, :format => "png", :owner_name => "sven", :name => "fuchs")
    end

    it 'shows an "unstable" button when the repository has broken build' do
      Factory(:broken_build, :repository => repository)

      should_receive_file_with_status("unstable")

      post(:show, :format => "png", :owner_name => "sven", :name => "fuchs")
    end

    it 'shows a "stable" button when the repository\'s last build passed' do
      Factory(:successfull_build, :repository => repository)

      should_receive_file_with_status("stable")

      post(:show, :format => "png", :owner_name => "sven", :name => "fuchs")
    end

    it 'shows a "stable" button when the previous build passed and there\'s one still running' do
      Factory(:successfull_build, :repository => repository)
      Factory(:running_build, :repository => repository)

      should_receive_file_with_status("stable")

      post(:show, :format => "png", :owner_name => "sven", :name => "fuchs")
    end
    
    def should_receive_file_with_status(status)
      controller.should_receive(:send_file).
        with("#{Rails.public_path}/images/status/#{status}.png", { :type=>"image/png", :disposition=>"inline" }).
        once
    end
  end
end
