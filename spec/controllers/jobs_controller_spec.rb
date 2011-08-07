require 'spec_helper'

describe JobsController, :type => :controller do
  before do
    # TODO shouldn't this use the actual output of the json rendering?
    repository = { 'id' => 8, 'slug' => 'svenfuchs/gem-release' }
    build_3    = { 'id' => 1, 'number' => '3',   'commit' => 'b0a1b69', 'config' => {} }
    build_31   = { 'id' => 2, 'number' => '3.1', 'commit' => 'b0a1b69', 'config' => {} }

    Resque.stubs(:peek).returns [
      { 'class' => 'Travis::Builder', 'args' => [ '1234', { 'repository' => repository, 'build' => build_3  } ] },
      { 'class' => 'Travis::Builder', 'args' => [ '5678', { 'repository' => repository, 'build' => build_31 } ] }
    ]
  end

  subject do
    get :index, :format => :json
    ActiveSupport::JSON.decode(response.body)
  end

  it 'index lists all jobs on the queue' do
    should == [
      { 'id' => 1, 'number' => '3',   'commit' => 'b0a1b69', 'repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
      { 'id' => 2, 'number' => '3.1', 'commit' => 'b0a1b69', 'repository' => { 'id' => 8, 'slug' => 'svenfuchs/gem-release' } },
    ]
  end
end
