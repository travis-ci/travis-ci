# a simple controller just for the home page
class HomeController < ApplicationController
  def index
    render :text => '', :layout => mobile? ? 'mobile' : 'application'
  end
end
