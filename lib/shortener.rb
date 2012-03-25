module Travis
  class Shortener < Sinatra::Base

    get '/' do
      redirect "http://#{Travis.config.host}"
    end

    get '/:id' do
      url = Url.where(:code => params[:id]).first

      if url
        redirect url.url
      else
        raise Sinatra::NotFound
      end
    end

  end
end
