require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!, :except => [:index, :show]
  skip_before_filter :verify_authenticity_token

  def index
    render :json => repository.builds.started.order('id DESC').limit(10).as_json
  end

  def show
    render :json => build.as_json
  end

  def create
    build.save!
    enqueue!(build)
    build.repository.update_attributes!(:last_built_at => Time.now) # TODO the build isn't actually started now
    render :nothing => true
  end

  def update
    build.update_attributes!(params[:build])

    if build.was_started?
      trigger('build:started')
    elsif build.matrix_expanded?
      build.matrix.each { |child| enqueue!(child) }
    elsif build.was_finished?
      trigger('build:finished')
      finished_email.deliver
    end

    render :nothing => true
  end

  def log
    id, msg_id, log = params[:build].values_at(*%w(id msg_id log))

    Travis::Synchronizer.receive(id, msg_id) do
      build.append_log!(log)
      trigger('build:log', 'log' => log, 'msg_id' => msg_id)
    end

    render :nothing => true
  end

  protected
    def repository
      @repository ||= params[:repository_id] ? Repository.find(params[:repository_id]) : build.repository
    end

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.create_from_github_payload(payload)
    end

    def payload
      @payload ||= JSON.parse(params[:payload])
    end

    def enqueue!(build)
      job  = Travis::Builder.enqueue(json_for(:job))
      build.update_attributes!(:job_id => job.meta_id)
      trigger('build:queued')
    end

    def finished_email
      BuildMailer.finished_email(build)
    end

    def trigger(event, data = {})
      push(event, json_for(event).merge(data))
    end

    def json_for(event)
      { 'build' => build.as_json(:for => event.to_sym), 'repository' => repository.as_json(:for => event.to_sym) }
    end

    def push(event, data)
      Pusher[event == 'build:queued' ? 'jobs' : 'repositories'].trigger(event, data)
    end
end
