require 'resque'

class JobsController < ApplicationController
  respond_to :json

  def index
    data = Resque.peek(:builds, 0, 50).map do |job|
      build = job['args'].last
      meta  = Travis::Builder.get_meta(job['args'].first)
      data  = build.slice('id', 'number', 'commit')
      data.update('repository' => build['repository'].slice('id', 'name', 'url'))
      data.update(meta.data.slice('meta_id', 'enqueued_at'))
    end
    render :json => data
  end
end
