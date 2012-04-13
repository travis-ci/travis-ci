require 'spec_helper'

describe Travis::Shortener do
  include Rack::Test::Methods
  let(:app) { subject }

  describe "GET /" do
    it "should redirect to travis-ci.org" do
      get '/'
      last_response.should be_redirect
      follow_redirect!
      last_request.url.should == 'http://travis-ci.org/'
    end
  end

  describe "GET /:id" do
    it "should redirect to the found url" do
      url = Url.create! :url => 'http://example.com'

      get "/#{url.code}"
      last_response.should be_redirect
      follow_redirect!
      last_request.url.should == 'http://example.com/'
    end

    it "should raise a 404 if the url couldn't be found" do
      get '/foobar'
      last_response.status.should == 404
    end
  end
end
