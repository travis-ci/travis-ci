require 'spec_helper'

describe 'routes redirection' do
  it 'the user is redirected to the hash bang version of the user route' do
    get '/svenfuchs'
    response.should redirect_to('http://www.example.com/#!/svenfuchs')
  end

  it 'the user is redirected to the hash bang version of the repository route' do
    get '/svenfuchs/travis'
    response.should redirect_to('http://www.example.com/#!/svenfuchs/travis')
  end

  it 'the user is redirected to the hash bang version of the repository builds route' do
    get '/svenfuchs/travis/builds'
    response.should redirect_to('http://www.example.com/#!/svenfuchs/travis/builds')
  end

  it 'the user is redirected to the hash bang version of the repository build route' do
    get '/svenfuchs/travis/builds/1'
    response.should redirect_to('http://www.example.com/#!/svenfuchs/travis/builds/1')
  end
end


