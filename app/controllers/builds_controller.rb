require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json
  before_filter :authenticate, :except => [:index, :show]
  skip_before_filter :verify_authenticity_token

  def index
    render :json => repository.builds.started.as_json(:full => true)
  end

  def show
    render :json => build.as_json(:full => true)
  end

  def create
    build.save
    job = Travis::Builder.enqueue(build.as_json)
    build.update_attributes!(:job_id => job.meta_id)
    build.repository.update_attributes!(:last_built_at => Time.now)
    render :nothing => true
  end

  def update
    build.update_attributes!(params[:build])
    finished_email.deliver if build.finished?
    render :nothing => true
  end

  def log
    build.append_log!(params[:build][:log])
    render :nothing => true
  end

  protected

    def repository
      @repository ||= Repository.find(params[:repository_id])
    end

    def build
      @build ||= params[:id] ? repository.builds.find(params[:id]) : repository.builds.build(payload)
    end

    def payload
      @payload ||= JSON.parse(params[:payload])
    end

    def finished_email
      BuildMailer.finished_email(build)
    end
end

