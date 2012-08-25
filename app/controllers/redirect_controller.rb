class RedirectController < ApplicationController
  def owner
    redirect_to "/#!/#{params[:owner]}"
  end

  def repository
    redirect_to "/#!/#{params[:owner]}/#{params[:name]}"
  end

  def builds
    redirect_to "/#!/#{params[:owner]}/#{params[:name]}/builds"
  end

  def build
    redirect_to "/#!/#{params[:owner]}/#{params[:name]}/builds/#{params[:id]}"
  end

  def job
    redirect_to "/#!/#{params[:owner]}/#{params[:name]}/jobs/#{params[:id]}"
  end
end
