require 'spec_helper'

describe RepositoriesController do
  describe 'GET :index returns a list of repositories' do
    before(:each) { Scenario.default }

    context 'in json' do
      it 'ordered by last build started date' do
        get(:index, :format => :json)

        response.should be_success
        result = ActiveSupport::JSON.decode(response.body)
        result.count.should == 2
        result.first['slug'].should  == 'svenfuchs/minimal'
        result.second['slug'].should == 'josevalim/enginex'
      end

      it 'filtered by owner name' do
        get(:index, :owner_name => 'svenfuchs', :format => :json)

        response.should be_success
        result = ActiveSupport::JSON.decode(response.body)
        result.count.should  == 1
        result.first['slug'].should == 'svenfuchs/minimal'
      end
    end
  end

  describe 'GET :show returns repository details' do
    let(:repository) { Scenario.default.first }

    it 'in json' do
      get :show, :owner_name => repository.owner_name, :name => repository.name, :format => 'json'

      ActiveSupport::JSON.decode(response.body).should == {
       'id' => repository.id,
       'slug' => 'svenfuchs/minimal',
       'last_build_finished_at' => '2010-11-12T12:30:20Z',
       'last_build_id' => repository.last_build_id,
       'last_build_number' => '2',
       'last_build_started_at' => '2010-11-12T12:30:00Z',
       'last_build_status' => 0
      }
    end
  end

  describe 'GET :show, format png' do
    before(:each) do
      controller.stubs(:render)
    end

    def get_png(repository, params = {})
      lambda { get :show, params.merge(:owner_name => repository.owner_name, :name => repository.name, :format => 'png') }
    end

    describe 'without a branch parameter' do
      it '"unknown" when the repository does not exist' do
        repository = Repository.new(:owner_name => 'does not', :name => 'exist')
        get_png(repository).should serve_status_image('unknown')
      end

      it '"unknown" when it only has a build that is not finished' do
        repository = Factory(:running_build).repository
        get_png(repository).should serve_status_image('unknown')
      end

      it '"unstable" when the last build has failed' do
        repository = Factory(:broken_build).repository
        get_png(repository).should serve_status_image('unstable')
      end

      it '"stable" when the last build has passed' do
        repository = Factory(:successfull_build).repository
        get_png(repository).should serve_status_image('stable')
      end

      it '"stable" when there is a running build but the previous one has passed' do
        repository = Factory(:successfull_build).repository
        Factory(:build, :repository => repository, :state => 'started')
        get_png(repository).should serve_status_image('stable')
      end
    end

    describe 'with a branch parameter' do
      it '"unknown" when the repository does not exist' do
        repository = Repository.new(:owner_name => 'does not', :name => 'exist')
        get_png(repository, :branch => 'master').should serve_status_image('unknown')
      end

      it '"unknown" when it only has a build that is not finished' do
        repository = Factory(:running_build).repository
        get_png(repository, :branch => 'master').should serve_status_image('unknown')
      end

      it '"unstable" when the last build has failed' do
        repository = Factory(:broken_build).repository
        get_png(repository, :branch => 'master').should serve_status_image('unstable')
      end

      it '"stable" when the last build has passed' do
        repository = Factory(:successfull_build).repository
        get_png(repository, :branch => 'master').should serve_status_image('stable')
      end

      it '"stable" when there is a running build but the previous one has passed' do
        repository = Factory(:successfull_build).repository
        Factory(:build, :repository => repository, :state => 'started')
        get_png(repository, :branch => 'master').should serve_status_image('stable')
      end
    end
  end
end

