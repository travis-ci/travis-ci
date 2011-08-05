require 'acceptance/acceptance_helper'

describe 'Routes redirection', :type => :controller do
  before { @controller  = RepositoriesController.new }

  it 'the user is redirected to the hash bang version of the user route' do
    get '/svenfuchs'
    response.should redirect_to('http://www.example.com/#!/svenfuchs')
  end

  it 'the user is redirected to the hash bang version of the repository route' do
    visit '/svenfuchs/travis'
    current_path.should == 'http://www.example.com/#!/svenfuchs/travis'
  end

  it 'the user is redirected to the hash bang version of the repository builds route' do
    visit '/svenfuchs/travis/builds'
    current_path.should == 'http://www.example.com/#!/svenfuchs/travis/builds'
  end

  it 'the user is redirected to the hash bang version of the repository build route' do
    visit '/svenfuchs/travis/builds/1'
    current_path.should == 'http://www.example.com/#!/svenfuchs/travis/builds/1'
  end
end

