require 'spec_helper'

describe Build do
  let(:repository) { Factory(:repository) }

  it 'deep_symbolizes config keys on write' do
    build = Factory(:build, :config => { 'foo' => { 'bar' => 'bar' } })
    build.config[:foo][:bar].should == 'bar'
  end

  it 'sets its number to the next build number on creation' do
    Factory(:build).reload.number.should == '1'
  end

  it '.next_number returns the next build number' do
    1.upto(3) do |number|
      Factory(:build, :repository => repository, :number => number)
      repository.builds.next_number.should == number + 1
    end
  end

  it 'finish sets the given status to the build'
  it 'pending? returns true if the build is not finished'
  it 'passed? returns true if status is 0'

  describe 'status_message' do
    it 'returns "Passed" if the build has passed'
    it 'returns "Failed" if the build has not passed'
    # TODO shouldn't it return an empty string if the build is pending?
  end

  describe 'color' do
    it 'returns an empty string if the build is pending'
    it 'returns "green" if the build has passed'
    it 'returns "red" if the build has failed'
  end
end
