class HomeController < ApplicationController

  # a simple controller just for the home page
  def index
    render :text => '', :layout => 'application'
  end

end