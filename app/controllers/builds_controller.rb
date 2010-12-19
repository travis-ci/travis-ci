require 'travis/build_listener'
require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json

  def show
    render :json => build.as_json['build']
  end

  def create
    payload = { :id => build.id, :uri => build.repository.uri, :commit => build.commit }
    job = Travis::Builder.enqueue(payload)
    Travis::BuildListener.add(job.meta_id, build)
    build.repository.update_attributes!(:last_built_at => Time.now)
    render :text => 'ok'
  end

  protected

    def repository
      build.repository
    end

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.build(JSON.parse(params[:payload]))
    end
end

