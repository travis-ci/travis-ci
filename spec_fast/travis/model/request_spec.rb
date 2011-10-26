require 'spec_helper'
require 'travis/model/request'

class Request; end

describe Travis::Model::Request do
  include Travis::Model

  let(:payload) { GITHUB_PAYLOADS['gem-release'] }
  let(:token)   { 'token' }
  let(:record)  { stub('record', :state= => nil) }

  before :each do
    ::Request.stubs(:create_from).returns(record)
  end

  describe '.create' do
    it 'creates a Request record' do
      ::Request.expects(:create_from).returns(record)
      Request.create(payload, token)
    end

    it 'instantiates a new Request with the record' do
      Request.create(payload, token).record.should == record
    end

    it 'sets the state :created to the record' do
      record.expects(:state=).with(:created)
      Request.create(payload, token)
    end
  end

  describe 'events' do
    xit 'should be specified'
  end
end
