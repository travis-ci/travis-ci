require 'spec_helper'

describe Task::Tagging do
  before :each do
    rules = YAML.load <<-yml
      - tag: rake_not_bundled
        pattern: rake is not part of the bundle
      - tag: database_missing
        pattern: database "[^"]*" does not exist
    yml
    Task::Tagging.stubs(:rules).returns(rules)
  end

  let(:test) { Factory(:build).matrix.first }

  describe :add_tags do
    it 'tags the task according to the rules' do
      test.update_attributes! :log => <<-log
        in `block in replace_gem': rake is not part of the bundle. Add it to Gemfile. (Gem::LoadError)
        PGError: FATAL:  database "data_migrations_test" does not exist
      log

      test.add_tags
      test.tags.should == 'rake_not_bundled,database_missing'
    end
  end
end


