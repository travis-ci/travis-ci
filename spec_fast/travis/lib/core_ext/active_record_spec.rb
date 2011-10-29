require 'spec_helper'
require 'core_ext/active_record/base'

describe ActiveRecord::Base, 'extensions' do
  describe 'floor' do
    subject { ActiveRecord::Base }

    before(:each) { @adapter = subject.configurations['test']['adapter'] rescue nil }
    after(:each)  { subject.configurations['test']['adapter'] = @adapter rescue nil }

    def using(adapter)
      subject.configurations['test'] ||= {}
      subject.configurations['test']['adapter'] = adapter
    end

    it 'returns an sql snippet for postgres' do
      using 'postgresql'
      subject.floor(:number).should == 'floor(number::float)'
    end

    it 'returns an sql snippet for mysql' do
      using 'mysql'
      subject.floor(:number).should == 'floor(number)'
    end

    it 'returns an sql snippet for sqlite3' do
      using 'sqlite3'
      subject.floor(:number).should == 'round(number - 0.5)'
    end
  end
end
