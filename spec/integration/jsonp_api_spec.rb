require 'spec_helper'

describe 'JSONP API' do
  let(:repository) do
    Factory(:repository, :owner_name => 'sven', :name => 'travis-ci', :last_build_started_at => Date.today)
  end

  before(:each) do
    config = { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'], 'env' => ['DB=sqlite3', 'DB=postgres'] }
    build = Factory(:build, :repository => repository, :config => config)
    build.matrix.each do |job|
      job.start!(:started_at => '2010-11-12T12:30:00Z')
      job.finish!(:result => job.config[:rvm] == '1.8.7' ? 0 : 1, :finished_at => '2010-11-12T12:30:20Z')
    end
    repository.reload
  end

  context 'callback parameter passed' do
    let(:path) { '/sven/travis-ci.json?callback=foo' }

    it 'returns text/javascript content type' do
      get path
      response.content_type.should == 'text/javascript'
    end

    it 'returns response in jsonp format' do
      get path
      validate_repository_info repository, response.body[/foo\((.*)\)/, 1]
    end
  end

  context 'no callback parameter passed' do
    let(:path) { '/sven/travis-ci.json' }

    it 'returns application/json content type' do
      get path
      response.content_type.should == 'application/json'
    end

    it 'returns response in json format' do
      get path
      validate_repository_info repository, response.body
    end
  end

  context 'callback parameter is not valid' do
    let(:path) { '/sven/travis-ci.json' }
    let(:callback) { '?callback=123' }

    it 'uses valid path' do
      get path
      response.status.should == 200
    end

    it 'returns bad request body' do
      get(path + callback)
      response.body.should == 'Bad Request'
    end

    it 'returns 400 status code' do
      get(path + callback)
      response.status.should == 400
    end
  end

  # TODO wat.
  def validate_repository_info(rep, info)
    json = ActiveSupport::JSON.decode(info)
    json.should == rep.attributes.slice(
       'id', 'description', 'last_build_id', 'last_build_number', 'last_build_status', 'last_build_result', 'last_build_language', 'last_build_duration'
    ).merge(
       'slug'                   => rep.slug,
       'last_build_status'      => rep.last_build_result,
       'last_build_result'      => rep.last_build_result,
       'last_build_started_at'  => rep.last_build_started_at.as_json,
       'last_build_finished_at' => rep.last_build_finished_at.as_json,
       'public_key'             => rep.key.public_key
    )
  end
end
