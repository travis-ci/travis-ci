require 'spec_helper'

class JobMock
  attr_accessor :state, :tags
end

describe Travis::Model::Job::Tagging do
  let(:rules) do
    YAML.load <<-yml
      - tag: rake_not_bundled
        pattern: rake is not part of the bundle
      - tag: database_missing
        pattern: database "[^"]*" does not exist
    yml
  end

  let(:log) do
    <<-log
      in `block in replace_gem': rake is not part of the bundle. Add it to Gemfile. (Gem::LoadError)
      PGError: FATAL:  database "data_migrations_test" does not exist
    log
  end

  let(:record) { JobMock.new.tap { |job| job.log = log } }
  let(:test)   { Travis::Model::Job::Test.new(record) }

  before :each do
    Travis::Model::Job::Tagging.stubs(:rules).returns(rules)
  end

  describe :add_tags do
    it 'tags the job according to the rules' do
      test.add_tags
      record.tags.should == 'rake_not_bundled,database_missing'
    end
  end
end

