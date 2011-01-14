require 'resque'

class WorkersController < ApplicationController
  respond_to :json

  def index
    render :json => Resque.workers.map { |worker| { :id => worker.to_s } }.compact
  end
end

