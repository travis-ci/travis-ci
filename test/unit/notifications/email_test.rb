require 'unit/notifications/notifications_test_case'

class EmailNotificationsTest < NotificationsTestCase
  def test_finished_email
    build = create_build(nil,
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 16, 47, 52)})

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
    build = create_build({ 'notifications' => { 'email' => ['user1@example.de', 'user2@example.de', 'user3@example.de'] } },
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52) })

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
    build = create_build({ 'notifications' => { 'email' => 'user1@example.de' } },
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52)})

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
    build = create_build({ 'notifications' => { 'email' => false } })

    assert_no_emails do
      Travis::Notifications::Email.notify(build)
    end
  end

  def test_finished_email_sent_via_travis_notifications
    build = create_build(nil,
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 16, 47, 52)})

    assert_emails(1) do
      Travis::Notifications.send_notifications(build)
    end
  end
end

class DeprecatedEmailNotificationsTest < NotificationsTestCase
  def test_finished_email_with_configured_email_addresses_as_array
    build = create_build({ 'notifications' => { 'recipients' => ['user1@example.de', 'user2@example.de', 'user3@example.de'] } },
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52) }
                        )

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
    build = create_build({ 'notifications' => { 'recipients' => 'user1@example.de' } },
                         { :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
                           :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52) })

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
    build = create_build({ 'notifications' => { 'disabled' => true } })

    assert_no_emails do
      Travis::Notifications::Email.notify(build)
    end
  end
end
