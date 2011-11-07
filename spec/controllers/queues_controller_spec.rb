require 'spec_helper'

describe QueuesController, :type => :controller do
  let!(:jobs) { [Factory.create(:test, :number => '3'), Factory.create(:test, :number => '3.1') ] }

  it 'index lists all jobs on the queue' do
    get :index, :format => :json

    json = ActiveSupport::JSON.decode(response.body)
    json.should include({ 'id' => jobs.first.id,  'number' => '3',   'commit' => '62aae5f70ceee39123ef', 'repository' => { 'id' => jobs.first.repository.id,  'slug' => jobs.first.repository.slug  } })
    json.should include({ 'id' => jobs.second.id, 'number' => '3.1', 'commit' => '62aae5f70ceee39123ef', 'repository' => { 'id' => jobs.second.repository.id, 'slug' => jobs.second.repository.slug } })
  end
end
