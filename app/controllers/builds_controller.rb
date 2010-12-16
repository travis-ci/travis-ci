require 'travis/build_listener'
require 'travis/builder'

class BuildsController < ApplicationController
  def show
    respond_to do |format|
      format.html
      format.json { render :json => build.as_json['build'] }
    end
  end

  def create
    payload = { :id => build.id, :uri => build.repository.uri, :commit => build.commit }
    meta = Travis::Builder.enqueue(payload)
    Travis::BuildListener.add(meta.meta_id, build)
    build.repository.update_attributes!(:last_built_at => Time.now)
    render :text => 'ok'
  end

  protected

    def repository
      build.repository
    end
    helper_method :repository

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.build(JSON.parse(params[:payload]))
    end
    helper_method :build
end

