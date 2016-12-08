# a simple controller just for the home page
class HomeController < ApplicationController
  def index
    if mobile_device?
      render :text => '', :layout => 'mobile'
    else
      render :text => '', :layout => 'application'
    end
  end
end
