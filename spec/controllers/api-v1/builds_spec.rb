require 'spec_helper'

describe BuildsController, 'JSON api version 1', :type => :controller do
  describe 'build index per repository' do
    attr_reader :repository, :build

    before do
      @repository = Factory(:repository, :owner_name => 'svenfuchs', :name => 'minimal')
      @build      = Factory(:build, :repository => repository, :state => 'finished', :status => 0, :started_at => '2010-11-11 12:00:00', :finished_at => '2010-11-11 12:00:10')
    end

    it 'returns json containing the expected keys' do
      get :index, :repository_id => repository.id, :format => :json

      build = JSON.parse(response.body).first
      task  = build['matrix'].first

      build.keys.should =~ %w(
        id repository_id matrix number config state status started_at finished_at
        commit branch compare_url message committed_at committer_email committer_name author_name author_email
      )
      task.keys.should =~ %w(
        id repository_id parent_id number config state status started_at finished_at
        commit branch compare_url message committed_at committer_email committer_name author_name author_email
      )
    end
  end
end
