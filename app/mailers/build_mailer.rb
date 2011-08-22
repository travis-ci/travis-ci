class BuildMailer < ActionMailer::Base
  default :from => 'notifications@travis-ci.org'

  helper BuildMailerHelper

  def finished_email(build)
    @build     = build

    mail(:to => build.unique_recipients, :subject => subject)
  end
  
  private
    def subject
      "[#{@build.status_message}] #{@build.repository.slug}##{@build.number} (#{@build.branch} - #{@build.commit[0, 7]})"
    end
end
