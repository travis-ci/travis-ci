require 'spec_helper'

describe ShortenerController do
  describe 'GET /' do
    it 'should redirect to travis-ci.org' do
      get '/', nil, { 'HTTP_HOST' => 'trvs.io' }
      response.should be_redirect
      response.should redirect_to "http://#{Travis.config.host}"
    end
  end

  describe 'GET /:id' do
    it 'should redirect to the found url' do
      url = Url.create!(url: 'http://example.com')

      get "/#{url.code}", nil, { 'HTTP_HOST' => 'trvs.io' }
      response.should be_redirect
      response.should redirect_to 'http://example.com'
    end

    it 'should raise a 404 if the url could not be found' do
      get '/foobar', nil, { 'HTTP_HOST' => 'trvs.io' }
      response.status.should == 404
    end
  end
end
