class ShortenerController < ActionController::Metal
  include ActionController::Redirecting
  include ActionController::Rendering

  def index
    redirect_to "http://#{Travis.config.host}"
  end

  def show
    if url
      redirect_to url.url
    else
      render :file => "#{Rails.root}/public/404", :formats => [:html], :status => 404
    end
  end

  private

    def url
      @url ||= Url.where(:code => params[:id]).first
    end
end
