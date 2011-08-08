require 'spec_helper'

describe TestsController do
  describe 'GET :show' do
    let(:test)       { Factory(:build).matrix.first.reload }
    let(:repository) { test.repository }

    it 'in json' do
      get :show, :id => test.id, :format => 'json'
      json_response.should == render_json(test)
    end
  end
end
