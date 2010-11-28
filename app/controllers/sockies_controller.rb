class SockiesController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def subscribe
    require 'ruby-debug'
    debugger
    render :text => "ok"
  end

  def unsubscribe
    render :text => "ok"
  end
end

