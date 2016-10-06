require File.expand_path(File.dirname(__FILE__) + '/acceptance_helper')

feature "Status Button", %q{
  In order to show the latest build status for my project
  As a user
  I want to be able to embed live status buttons on my website
} do

  scenario 'Show an "unknown" button when the repository does not exist' do
    Repository.delete_all(:owner_name => "svenfuchs", :name => "travis")
    visit "/svenfuchs/travis.png"
    controller.should_receive(:send_file).with("/images/status/unknown.png").once
  end
end
