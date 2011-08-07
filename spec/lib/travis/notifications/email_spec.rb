require 'spec_helper'

RSpec::Matchers.define :send_email_notification_on do |event|
  match do |build|
    # Travis::Notifications::Email.new.notify(event, build)
    dispatch =  lambda { Travis::Notifications.dispatch(event, build) }
    dispatch.should change(ActionMailer::Base.deliveries, :size).by(1)
    ActionMailer::Base.deliveries.last
  end
end

describe Travis::Notifications::Email do
  before do
    Travis.config.notifications = [:email]
  end

  after do
    Travis.config.notifications.clear
    Travis::Notifications.subscriptions.clear
  end

  it "finished email" do
    started_at  = Time.zone.local(2011, 6, 23, 15, 30, 45)
    finished_at = Time.zone.local(2011, 6, 23, 16, 47, 52)

    repository = Factory(:repository, :owner_email => 'owner@example.com')
    commit     = Factory(:commit, :committer_email => 'committer@example.com', :author_name => 'Author', :author_email => 'author@example.com', :compare_url => 'compare_url')
    build      = Factory(:build, :state => 'finished', :started_at => started_at, :finished_at => finished_at, :commit => commit)

    email = build.should send_email_notification_on('build:finished')
    email.should deliver_to(['owner@example.com', 'committer@example.com', 'author@example.com'])
    email.should have_subject('svenfuchs/minimal#1 (master - 62aae5f): the build has failed')

    email.should have_body_text(%(
      Build : #1

      Duration : 1 hour, 17 minutes, and 7 seconds
      Commit : 62aae5f7 (master)
      Author : Author
      Message : the commit message

      Status : Failed

      View the changeset : compare_url

      View the full build log and details : http://localhost:3000/svenfuchs/minimal/builds/#{build.id}
    ))
  end
end
