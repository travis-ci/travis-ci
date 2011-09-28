require 'spec_helper'

describe Travis::Notifications::Email do
  before do
    Travis.config.notifications = [:email]
  end

  it "finished email" do
    started_at  = Time.zone.local(2011, 6, 23, 15, 30, 45)
    finished_at = Time.zone.local(2011, 6, 23, 16, 47, 52)

    repository = Factory(:repository, :owner_email => 'owner@example.com')
    commit     = Factory(:commit, :committer_email => 'committer@example.com', :author_name => 'Author', :author_email => 'author@example.com', :compare_url => 'compare_url')
    build      = Factory(:build, :state => 'finished', :started_at => started_at, :finished_at => finished_at, :commit => commit)

    email = build.should send_email_notification_on('build:finished')
    email.should deliver_to(['owner@example.com', 'committer@example.com', 'author@example.com'])
    email.should have_subject('[Failed] svenfuchs/minimal#1 (master - 62aae5f)')

    # Test text part
    # -------------------------------------------------
    email.text_part.body.should include(%Q{
Build : #1

Duration : 1 hour, 17 minutes, and 7 seconds
Commit : 62aae5f7 (master)
Author : Author
Message : the commit message

Status : Failed

View the changeset : compare_url

View the full build log and details : http://localhost:3000/svenfuchs/minimal/builds/#{build.id}})

    # Test HTML part
    # -------------------------------------------------
    ['Repository', 'Build', 'Duration', 'Commit', 'Author', 'Message', 'Status'].each do |heading|
      email.should have_body_text(heading)
    end

    ['1 hour, 17 minutes, and 7 seconds',
    '62aae5f7 (master)',
    'Author',
    'the commit message',
    'Failed',
    'View the changeset',
    'compare_url',
    'View the full build log and details',
    "http://localhost:3000/svenfuchs/minimal/builds/#{build.id}"].each do |content|
      email.should have_body_text(content)
    end
  end
end

