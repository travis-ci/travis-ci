# a simple controller just for the home page
class HomeController < ApplicationController
  def index
    if mobile_device?
      render :text => '', :layout => 'mobile'
    else
      render :text => '', :layout => 'application'
    end
  end

  def route_not_found(error)
    logger.warn("404: #{error.message}")
    render :file => "#{Rails.root}/public/404.html", :status => 404, :layout => false
  end
end
