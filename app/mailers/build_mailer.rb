class BuildMailer < ActionMailer::Base
  default :from => 'notifications@travis-ci.org'

  def finished_email(build)
    @build     = build
    subject    = "#{build.repository.slug}##{build.number} (#{build.commit[0, 7]}): the build has #{build.passed? ? 'passed' : 'failed' }"
    recipients = unique_recipients(build)
    mail(:to => recipients, :subject => subject)
  end

  protected

    def unique_recipients(build)
      if build.config && notifications = build.config['notifications']
        notifications['recipients']
      else
        recipients = [build.committer_email, build.author_email, build.repository.owner_email]
        recipients.select(&:present?).join(',').split(',').map(&:strip).uniq.join(',')
      end
    end
end
