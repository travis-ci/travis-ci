require 'spec_helper'

describe 'JSONP API' do
  let(:repository) do
    FactoryGirl.create(:repository, :owner_name => 'sven', :name => 'travis-ci', :last_build_started_at => Date.today).tap do |repo|
      repo.key = Factory(:ssl_key, :repository => repo)
    end
  end

  before(:each) do
    config = { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'], 'env' => ['DB=sqlite3', 'DB=postgres'] }
    build = FactoryGirl.create(:build, :repository => repository, :config => config)
    build.matrix.each do |job|
      job.start!(:started_at => '2010-11-12T12:30:00Z')
      job.finish!(:status => job.config[:rvm] == '1.8.7' ? 0 : 1, :finished_at => '2010-11-12T12:30:20Z')
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
      valid_repository_info?(response.body[/foo\((.*)\)/, 1]).should be_true
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
      valid_repository_info?(response.body).should be_true
    end
  end

  context 'callback parameter is not valid' do
    let(:path) { '/sve/travis-ci.json?callback=123' }

    it 'returns bad request body' do
      get path
      response.body.should == 'Bad Request'
    end

    it 'returns 400 status code' do
      get path
      response.status.should == 400
    end
  end

  def valid_repository_info?(info)
    ActiveSupport::JSON.decode(info) == {
       'id'                     => repository.id,
       'slug'                   => 'sven/travis-ci',
       'description'            => nil,
       'last_build_finished_at' => '2010-11-12T12:30:20Z',
       'last_build_id'          => repository.last_build_id,
       'last_build_number'      => '1',
       'last_build_started_at'  => '2010-11-12T12:30:00Z',
       'last_build_result'      => 1,
       'last_build_status'      => 1,
       'last_build_language'    => nil,
       'last_build_duration'    => 160,
       'public_key'             => "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAMZ53W7GX2zMvQ9UT8Hq/08Oyj7FEez171gMHwOb5BgUPJ1253WfXXfh\nljf0PGDrM2FcMYpiKUc/gT1ugi6+B9IAM3XZ4PVyWiBfjozigEaBQCG2vlC8Yuf1\nMRbght4j6cOyEwktMt62EKYHofCbkt31CdFVPpT8DO05O/14n/EpAgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
    }
  end
end