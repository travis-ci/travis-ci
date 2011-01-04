require 'travis/builder'

class BuildsController < ApplicationController
  respond_to :json
  before_filter :authenticate, :except => :show
  skip_before_filter :verify_authenticity_token

  def show
    render :json => build.as_json(:full => true)['build']
  end

  def create
    build.save
    job = Travis::Builder.enqueue(build.as_json['build'])
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
      build.repository
    end

    def build
      @build ||= params[:id] ? Build.find(params[:id]) : Build.build(payload)
    end

    def payload
      @payload ||= JSON.parse(params[:payload])
    end

    def finished_email
      BuildMailer.finished_email(build)
    end
end

