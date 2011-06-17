module NavigationHelpers
  # Put helper methods related to the paths in your application here.
  def profile_page
    "/profile"
  end
  def homepage
    "/"
  end
end

RSpec.configuration.include NavigationHelpers, :type => :acceptance
