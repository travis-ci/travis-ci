class BuildMailer < ActionMailer::Base
  default :from => 'notifications@travis-ci.org'

  helper BuildMailerHelper

  def finished_email(build)
    @build     = build
    @commit    = build.commit
    recipients = build.email_recipients
    mail(:to => recipients, :subject => subject)
  end

  private
    def subject
      "[#{@build.status_message}] #{@build.repository.slug}##{@build.number} (#{@commit.branch} - #{@commit.commit[0, 7]})"
    end
end
