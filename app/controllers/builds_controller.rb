require 'nanite'

class BuildsController < ApplicationController
  def show
    respond_to do |format|
      format.html
      format.js { render :text => build.log }
    end
  end

  def create
    queue(build)
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

    def build_json
      @build_json ||= build.as_json
    end

    def queue(build)
      payload = { :uri => build.repository.uri, :commit => build.commit }
      log = ''

      build.repository.update_attributes!(:last_built_at => Time.now)
      trigger :build_started

      intermediate_handler = lambda do |key, builder, message, job|
        log << message
        # build.update_attributes!(:log => log)
        trigger :build_updated, :message => message
      end

      Nanite.request('/builder/build', payload, :intermediate_handler => intermediate_handler) do |results, job|
        status  = results.values.first[:status]
        message = "build finished, status: #{status.inspect}"

        log << message
        build.update_attributes!(:finished_at => Time.now, :status => status, :log => log)
        trigger :build_finished, :status => status, :message => message
      end
    end

    def trigger(event, data = {})
      channel = "repository_#{build.repository_id}"
      notify_clients event, build_json.merge(data) # , :channels => channel
    end

    def notify_clients(event, data, options = {})
      Socky.send(data.merge(:event => event).to_json, options)
    end
end

