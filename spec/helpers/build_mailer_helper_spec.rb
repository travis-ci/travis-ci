require 'spec_helper'

describe BuildMailerHelper do
  let(:build) { Factory(:successfull_build) }

  it '#title returns title for the build' do
    title(build).should == 'Build Update for svenfuchs/successfull_build'
  end
end
