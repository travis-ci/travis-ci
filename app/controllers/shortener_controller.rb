class ShortenerController < ActionController::Metal
  include ActionController::Redirecting
  include ActionController::Rendering

  def index
    redirect_to "http://#{Travis.config.host}"
  end

  def show
    url = Url.where(:code => params[:id]).first

    if url
      redirect_to url.url
    else
      render :file => "#{Rails.root}/public/404.html", :status => 404
    end
  end

end
