class BuildMailer < ActionMailer::Base
  default :from => 'notifications@travis-ci.org'

  def finished_email(build)
    @build  = build
    subject = "#{build.repository.name}##{build.number} (#{build.commit[0, 7]}): the build has #{build.passed? ? 'passed' : 'failed' }"
    mail(:to => build.committer_email, :subject => subject)
  end
end
