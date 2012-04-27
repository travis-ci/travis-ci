require 'spec_helper'
require 'travis/api'

describe Travis::Api::Json::Http::Workers do
  let(:workers) { [Factory(:worker)] }
  let(:data)    { Travis::Api::Json::Http::Workers.new(workers).data }

  before(:each) do
    Time.stubs(:now).returns(Time.utc(2011, 11, 11, 11, 11, 11))
  end

  it 'workers' do
    data.first.should == {
      'id' => workers.first.id,
      'name' => 'worker-1',
      'host' => 'ruby-1.workers.travis-ci.org',
      'state' => 'working',
      'last_seen_at' => '2011-11-11T11:11:11Z',
      'payload' => nil,
      'last_error' => nil
    }
  end
end
