require 'spec_helper'

describe BuildMailerHelper do
  let(:build) { Factory(:successful_build) }

  it '#title returns title for the build' do
    title(build).should == 'Build Update for svenfuchs/successful_build'
  end
end
