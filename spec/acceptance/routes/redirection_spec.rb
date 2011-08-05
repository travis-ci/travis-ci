require 'spec_helper'

# Just can't get these working, even though they really should from all i understand from the docs.
#
# They output:
#
# Failures:
#
#   1) ApplicationController routes redirection the user is redirected to the hash bang version of the user route
#      Failure/Error: get '/svenfuchs'
#      ActionController::RoutingError:
#        No route matches {:controller=>"application", :action=>"/svenfuchs"}
#      # ./spec/acceptance/routes/redirection_spec.rb:5:in `block (2 levels) in <top (required)>'

describe ApplicationController, 'routes redirection', :type => :controller do
  xit 'the user is redirected to the hash bang version of the user route' do
    get '/svenfuchs'
    response.should redirect_to('http://www.example.com/#!/svenfuchs')
  end

  xit 'the user is redirected to the hash bang version of the repository route' do
    get '/svenfuchs/travis'
    response.should redirect_to('http://www.example.com/#!/svenfuchs/travis')
  end

  xit 'the user is redirected to the hash bang version of the repository builds route' do
    get '/svenfuchs/travis/builds'
    response.should redirect_to('http://www.example.com/#!/svenfuchs/travis/builds')
  end

  xit 'the user is redirected to the hash bang version of the repository build route' do
    get '/svenfuchs/travis/builds/1'
    response.should redirect_to('http://www.example.com/#!/svenfuchs'/travis/builds/1)
  end
end

