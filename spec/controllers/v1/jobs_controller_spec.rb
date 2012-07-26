require 'spec_helper'

describe V1::JobsController do
  describe 'GET :index' do
    let!(:jobs) {[
      FactoryGirl.create(:test, number: '3.1', queue: 'builds.common'),
      FactoryGirl.create(:test, number: '3.2', queue: 'builds.common')
    ]}

    it 'index lists all jobs on the queue' do
      get :index, queue: 'builds.common', format: :json
      json_response.should == json_for_http(Job.queued.where(queue: 'builds.common'), type: :jobs, version: 'v1')
    end
  end

  describe 'GET :show' do
    let(:test)       { Factory(:build).matrix.first.reload }
    let(:repository) { test.repository }

    it 'in json' do
      get :show, id: test.id, format: 'json'
      json_response.should == json_for_http(test, version: 'v1')
    end
  end
end
