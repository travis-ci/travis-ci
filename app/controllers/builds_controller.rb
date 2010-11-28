require 'nanite'

class BuildsController < ApplicationController
  def show
    render :text => build.log
  end

  def create
    queue(build)
    render :text => 'ok'
  end

  protected

    def repositories
      @repositories ||= Repository.order(:uri)
    end
    helper_method :repositories

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.build(JSON.parse(params[:payload]))
    end

    def queue(build)
      build_data = build.as_json
      payload = { :uri => build.repository.uri, :commit => build.commit }
      channel = "repository_#{build.repository_id}"
      log = ''

      notify_clients 'build_started', build_data

      intermediate_handler = lambda do |key, builder, message, job|
        log << message
        notify_clients 'build_updated', build_data.merge(:message => message) #, :channels => channel
      end

      Nanite.request('/builder/build', payload, :intermediate_handler => intermediate_handler) do |results, job|
        status  = results.values.first[:status]
        message = "build finished, status: #{status.inspect}"
        log << message

        notify_clients 'build_finished', build_data.merge(:status => status, :message => message) #, :channels => channel
        build.update_attributes(:finished_at => Time.now, :status => status, :log => log)
      end
    end

    def notify_clients(event, data, options = {})
      Socky.send(data.merge(:event => event).to_json, options)
    end
end

