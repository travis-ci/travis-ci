class ProfilesController < ApplicationController
  before_filter :authenticate_user!
end
