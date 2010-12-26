require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json
  skip_before_filter :verify_authenticity_token

  def show
    render :json => build.as_json(:full => true)['build']
  end

  def create
    build.save
    job = Travis::Builder.enqueue(build.as_json['build'])
    build.update_attributes!(:job_id => job.meta_id)
    build.repository.update_attributes!(:last_built_at => Time.now)
    render :text => 'ok'
  end

  def update
    build.update_attributes!(params[:build])
    render :text => 'ok'
  end

  def log
    build.append_log!(params[:build][:log])
    render :text => 'ok'
  end

  protected

    def repository
      build.repository
    end

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.build(payload)
    end

    def payload
      @payload ||= JSON.parse(params[:payload])
    end
end

