require 'travis'

describe Travis::Consumer do
  let(:consumer) { Travis::Consumer.new }

  describe 'decode' do
    let(:payload) { consumer.send(:decode, '{ "id": 1 }') }

    it 'decodes a json payload' do
      payload['id'].should == 1
    end

    it 'returns a Hashr instance' do
      payload.should be_kind_of(Hashr)
    end
  end

  describe 'handler_for' do
    events = %w(
      task:config:started
      task:config:finished
      task:test:started
      task:test:log
      task:test:finished
    )

    events.each do |event|
      it "returns a Task handler for #{event.inspect}" do
        consumer.send(:handler_for, event).should be_kind_of(Travis::Consumer::Task)
      end
    end
  end
end

