require 'spec_helper'

describe Repository, 'json' do
  describe 'for the http api' do
    attr_reader :repository

    before do
      @repository = Scenario.default.first
    end

    it 'returns the expected json' do
      json = to_json(repository)
      build = repository.last_build

      json.should == {
        'id' => repository.id,
        'slug' => 'svenfuchs/minimal',
        'last_build_id' => build.id,
        'last_build_number' => build.number.to_i,
        'last_build_status' => build.status,
        'last_build_started_at' => '2010-11-12T12:30:00Z',
        'last_build_finished_at' => '2010-11-12T12:30:20Z',
      }
    end
  end
end


