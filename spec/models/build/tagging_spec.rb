require 'spec_helper'

describe Build::Tagging do
  let(:build) { Factory(:build) }

  it "Automatic MissingTravisFile tag addition " do
    log = "$ no Travis file git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n"
    build.update_attributes!(:log => log)

    build.add_tags
    assert_equal build.tags, "MissingTravisFile"
  end

  it "Automatic MissingRakeFile tag addition " do
    log = "$ no RakeFile git clone --depth=1000 --quiet git://github.com/intridea/omniauth.git ~/builds/intridea/omniauth\n"
    build.update_attributes!(:log => log)

    build.add_tags
    assert_equal build.tags, "MissingRakeFile"
  end
end


