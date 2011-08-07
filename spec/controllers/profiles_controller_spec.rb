require 'spec_helper'

describe ProfilesController do
  include Devise::SignInHelpers

  let(:user) { Factory(:user) }

  before(:each) do
    sign_in_user user
  end

  it 'should be specified'
end
