require 'spec_helper'

describe "v1/default/empty.rabl" do
  it "renders empty JSON array" do
    render
    rendered.should == "[]"
  end
end
