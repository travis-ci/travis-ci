require 'unit/notifications/notifications_test_case'

class EmailNotificationsTest < NotificationsTestCase
  def test_finished_email
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 16, 47, 52),
      :committer_email => 'bar@example.com',
      :author_name => 'Foo Bar',
      :author_email => 'baz@example.com',
      :status => 1,
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master"
    })

    email = nil
    assert_emails(1) do
      email = Travis::Notifications::Email.notify(build)
    end

    assert_equal ['bar@example.com', 'baz@example.com', 'foo@example.com'], email.to
    assert_equal 'svenfuchs/minimal#1 (master - 62aae5f): the build has failed', email.subject

    assert_match /Duration : 1 hour, 17 minutes, and 7 seconds/,  email.encoded
    assert_match /Message : the commit message/,                  email.encoded
    assert_match /Status : Failed/,                               email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_finished_email_with_configured_email_addresses_as_array
    config = { 'notifications' => { 'email' => ['user1@example.de', 'user2@example.de', 'user3@example.de'] } }
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    email = nil
    assert_emails(1) do
      email = Travis::Notifications::Email.notify(build)
    end

    assert_equal ["user1@example.de", "user2@example.de", "user3@example.de"],   email.to
    assert_equal 'svenfuchs/minimal#1 (master - 62aae5f): the build has failed', email.subject

    assert_match /Duration : 17 minutes and 7 seconds/, email.encoded
    assert_match /Message : the commit message/,        email.encoded
    assert_match /Status : Failed/,                     email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_finished_email_with_configured_email_address_as_string
    config = { 'notifications' => { 'email' => 'user1@example.de' } }
    build = Factory(:build, {
      :repository  => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    email = nil
    assert_emails(1) do
      email = Travis::Notifications::Email.notify(build)
    end

    assert_equal ["user1@example.de"], email.to
    assert_equal 'svenfuchs/minimal#1 (master - 62aae5f): the build has failed', email.subject

    assert_match /Duration : 7 seconds/,         email.encoded
    assert_match /Message : the commit message/, email.encoded
    assert_match /Status : Failed/,              email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_email_notifications_turned_off
    config = { 'notifications' => { 'email' => false } }
    build = Factory(:build, {
      :repository  => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    assert_no_emails do
      Travis::Notifications::Email.notify(build)
    end
  end

  def test_finished_email_sent_via_travis_notifications
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 16, 47, 52),
      :committer_email => 'bar@example.com',
      :author_name => 'Foo Bar',
      :author_email => 'baz@example.com',
      :status => 1,
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master"
    })

    assert_emails(1) do
      Travis::Notifications.send_notifications(build)
    end
  end
end

class DeprecatedEmailNotificationsTest < NotificationsTestCase
  def test_finished_email_with_configured_email_addresses_as_array
    config = { 'notifications' => { 'recipients' => ['user1@example.de', 'user2@example.de', 'user3@example.de'] } }
    build = Factory(:build, {
      :repository => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    email = nil
    assert_emails(1) do
      email = Travis::Notifications::Email.notify(build)
    end

    assert_equal ["user1@example.de", "user2@example.de", "user3@example.de"],   email.to
    assert_equal 'svenfuchs/minimal#1 (master - 62aae5f): the build has failed', email.subject

    assert_match /Duration : 17 minutes and 7 seconds/, email.encoded
    assert_match /Message : the commit message/,        email.encoded
    assert_match /Status : Failed/,                     email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_finished_email_with_configured_email_address_as_string
    config = { 'notifications' => { 'recipients' => 'user1@example.de' } }
    build = Factory(:build, {
      :repository  => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    email = nil
    assert_emails(1) do
      email = Travis::Notifications::Email.notify(build)
    end

    assert_equal ["user1@example.de"], email.to
    assert_equal 'svenfuchs/minimal#1 (master - 62aae5f): the build has failed', email.subject

    assert_match /Duration : 7 seconds/,         email.encoded
    assert_match /Message : the commit message/, email.encoded
    assert_match /Status : Failed/,              email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_email_notifications_turned_off
    config = { 'notifications' => { 'disabled' => true } }
    build = Factory(:build, {
      :repository  => @repository,
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })

    assert_no_emails do
      Travis::Notifications::Email.notify(build)
    end
  end
end
