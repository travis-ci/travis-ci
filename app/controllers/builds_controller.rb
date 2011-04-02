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
      trigger('build:started', build, 'msg_id' => params[:msg_id])
    elsif build.matrix_expanded?
      build.matrix.each { |child| enqueue!(child) }
      trigger('build:expanded', build, 'msg_id' => params[:msg_id])
    elsif build.was_finished?
      trigger('build:finished', build, 'msg_id' => params[:msg_id])
      deliver_finished_email
    end

    render :nothing => true
  end

  def log
    unless build.finished?
      build.append_log!(params[:build][:log])
      trigger('build:log', build, 'log' => params[:build][:log], 'msg_id' => params[:msg_id])
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
      job  = Travis::Builder.enqueue(json_for(:job, build))
      build.update_attributes!(:job_id => job.meta_id)
      trigger('build:queued', build)
    end

    def deliver_finished_email
      BuildMailer.finished_email(build.parent || build).deliver if !build.parent || build.parent.finished?
    end

    def trigger(event, build = self.build, data = {})
      push(event, json_for(event, build).merge(data))
      trigger(event, build.parent) if event == 'build:finished' && build.parent.try(:finished?)
    end

    def json_for(event, build = self.build)
      { 'build' => build.as_json(:for => event.to_sym), 'repository' => build.repository.as_json(:for => event.to_sym) }
    end

    def push(event, data)
      Pusher[event == 'build:queued' ? 'jobs' : 'repositories'].trigger(event, data)
    end
end
