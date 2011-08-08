require 'travis'

class TestsController < ApplicationController
  responders :rabl

  respond_to :json

  def show
    respond_with test
  end

  protected

    def test
      @test ||= Task::Test.find(params[:id])
    end
end

