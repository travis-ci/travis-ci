require 'spec_helper'

describe "Token", ActiveSupport::TestCase do
  it 'generate_token sets the token to a 20 character value' do
    Token.new.send(:generate_token).length.should == 20
  end
end

