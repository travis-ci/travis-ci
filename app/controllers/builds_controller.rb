require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json
  before_filter :authenticate_user!, :except => [:index, :show]
  skip_before_filter :verify_authenticity_token

  def index
    render :json => repository.builds.started.as_json(:full => true)
  end

  def show
    render :json => build.as_json(:full => true)
  end

  def create
    build.save!
    enqueue!(build)
    build.repository.update_attributes!(:last_built_at => Time.now) # TODO the build isn't actually started now
    render :nothing => true
  end

  def update
    build.update_attributes!(params[:build])
    if build.matrix_expanded?
      build.matrix.each { |child| enqueue!(build) }
    elsif build.finished?
      finished_email.deliver
    end
    render :nothing => true
  end

  def log
    build.append_log!(params[:build][:log])
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
      job = Travis::Builder.enqueue(build.as_json)
      Pusher['jobs'].trigger('build:queued', :build => build.as_json.merge(:meta_id => job.meta_id, :enqueued_at => job.enqueued_at))
      build.update_attributes!(:job_id => job.meta_id)
    end

    def finished_email
      BuildMailer.finished_email(build)
    end
end
