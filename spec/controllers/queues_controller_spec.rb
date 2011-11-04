require 'spec_helper'

describe QueuesController, :type => :controller do
  before do
    # TODO shouldn't this use the actual output of the json rendering?
    repository = { 'id' => 8, 'slug' => 'svenfuchs/gem-release' }
    build_3    = { 'id' => 1, 'number' => '3',   'commit' => 'b0a1b69', 'config' => {} }
    build_31   = { 'id' => 2, 'number' => '3.1', 'commit' => 'b0a1b69', 'config' => {} }
  end

  subject do
    get :index, :format => :json
    ActiveSupport::JSON.decode(response.body)
  end

  it 'index lists all jobs on the queue' do
    pending
    should == [
      { 'id' => 1, 'number' => '3',   'commit' => 'b0a1b69', 'repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
      { 'id' => 2, 'number' => '3.1', 'commit' => 'b0a1b69', 'repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
    ]
  end
end
