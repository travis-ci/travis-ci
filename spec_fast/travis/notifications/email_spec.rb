require 'spec_helper'

describe Travis::Notifications::Email do
  let(:build) { Travis::Models::Build.new(record) }

  before do
    Travis.config.notifications = [:email]
  end

  it 'should be specified'
end

