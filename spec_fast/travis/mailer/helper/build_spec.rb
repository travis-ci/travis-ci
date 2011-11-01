require 'spec_helper'
require 'support/active_record'

describe Travis::Mailer::Helper::Build do
  include Travis::Mailer::Helper::Build

  let(:build) { Factory(:successful_build) }

  it '#title returns title for the build' do
    title(build).should == 'Build Update for svenfuchs/successful_build'
  end
end

