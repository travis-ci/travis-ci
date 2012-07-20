require 'spec_helper'

describe 'routes redirection' do

  it 'should redirect to the default locale when redirecting' do
    get '/somethingcrazy'
    response.should redirect_to("http://www.example.com/#/somethingcrazy")
  end

  it 'the user is redirected to the hash bang version of the user route' do
    get '/sven.fuchs'
    response.should redirect_to('http://www.example.com/#/sven.fuchs')
  end

  it 'the user is redirected to the hash bang version of the repository route' do
    get '/svenfuchs/travis-ci.org'
    response.should redirect_to('http://www.example.com/#/svenfuchs/travis-ci.org')
  end

  it 'the user is redirected to the hash bang version of the repository builds route' do
    get '/svenfuchs/travis-ci.org/builds'
    response.should redirect_to('http://www.example.com/#/svenfuchs/travis-ci.org/builds')
  end

  it 'the user is redirected to the hash bang version of the repository build route' do
    get '/svenfuchs/travis/builds/1'
    response.should redirect_to('http://www.example.com/#/svenfuchs/travis/builds/1')
  end
end


