# a simple controller just for the home page
class HomeController < ApplicationController
  def index
    render :text => '', :layout => 'application'
  end
end
