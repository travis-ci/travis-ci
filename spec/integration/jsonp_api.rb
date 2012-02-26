require 'spec_helper'

describe 'jsonp API' do
  let(:repository) do
    FactoryGirl.create(:repository, :owner_name => 'sven', :name => 'travis-ci', :last_build_started_at => Date.today).tap do |repo|
      repo.key = Factory(:ssl_key, :repository => repo)
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

  before(:each) do
    config = { 'rvm' => ['1.8.7', '1.9.2'], 'gemfile' => ['test/Gemfile.rails-2.3.x', 'test/Gemfile.rails-3.0.x'], 'env' => ['DB=sqlite3', 'DB=postgres'] }
    build = FactoryGirl.create(:build, :repository => repository, :config => config)
    build.matrix.each do |job|
      job.start!(:started_at => '2010-11-12T12:30:00Z')
      job.finish!(:status => job.config[:rvm] == '1.8.7' ? 0 : 1, :finished_at => '2010-11-12T12:30:20Z')
    end
    repository.reload
  end

  it 'returns repository info in jsonp format if callback parameter passed' do
    get '/sven/travis-ci.json?callback=foo'
    valid_repository_info?(response.body[/foo\((.*)\)/, 1]).should be_true
  end

  it 'returns repository info in json format if no callback parameter passed' do
    get '/sven/travis-ci.json'
    valid_repository_info?(response.body).should be_true
  end

  it 'returns bad request if callback parameter is not valid' do
    get '/sve/travis-ci.json?callback=123'
    response.body.should == 'Bad Request'
    response.status.should == 400
  end
end