require 'spec_helper'
require 'core_ext/active_record/base'

describe ActiveRecord::Base, 'extensions' do
  describe 'floor' do
    subject { ActiveRecord::Base }

    before(:each) { @adapter = subject.configurations['test']['adapter'] }
    after(:each)  { subject.configurations['test']['adapter'] = @adapter }

    def adapter(adapter)
      subject.configurations['test']['adapter'] = adapter
    end

    it 'returns an sql snippet for postgres' do
      adapter 'postgresql'
      subject.floor(:number).should == 'floor(number::float)'
    end

    it 'returns an sql snippet for mysql' do
      adapter 'mysql'
      subject.floor(:number).should == 'floor(number)'
    end

    it 'returns an sql snippet for sqlite3' do
      adapter 'sqlite3'
      subject.floor(:number).should == 'round(number - 0.5)'
    end
  end
end
