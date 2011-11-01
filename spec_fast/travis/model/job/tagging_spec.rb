require 'spec_helper'

class JobMock
  include Job::Tagging
  attr_accessor :state, :tags, :log, :config
end

describe Job::Tagging do
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

  let(:test) { JobMock.new.tap { |job| job.log = log } }

  before :each do
    Job::Tagging.stubs(:rules).returns(rules)
  end

  describe :add_tags do
    it 'tags the job according to the rules' do
      test.add_tags
      test.tags.should == 'rake_not_bundled,database_missing'
    end
  end
end

