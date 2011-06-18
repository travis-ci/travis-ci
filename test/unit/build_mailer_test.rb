require 'test_helper'

class BuildMailerTest < ActionMailer::TestCase

  def before
    Time.zone = 'Amsterdam'
  end

  def test_finished_email
    repository = Factory(:repository, :owner_email => 'foo@example.com')
    build = Factory(:build, {
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 16, 47, 52),
      :committer_email => 'bar@example.com',
      :author_name => 'Foo Bar',
      :author_email => 'baz@example.com',
      :status => 1,
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master"
    })

    email = BuildMailer.finished_email(build).deliver

    assert !ActionMailer::Base.deliveries.empty?

    assert_equal ['bar@example.com', 'baz@example.com', 'foo@example.com'], email.to
    assert_equal 'svenfuchs/minimal#1 (62aae5f): the build has failed', email.subject

    assert_match /Duration : 1 hour, 17 minutes, and 7 seconds/,  email.encoded
    assert_match /Message : the commit message/,                  email.encoded
    assert_match /Status : Failed/,                               email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_finished_email_with_configured_email_addresses_as_array
    repository = Factory(:repository, :owner_email => 'foo@example.com')
    config = {'notifications' => {'recipients' => ['user1@example.de', 'user2@example.de', 'user3@example.de']}}
    build = Factory(:build, {
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 47, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })
    email = BuildMailer.finished_email(build).deliver
    assert !ActionMailer::Base.deliveries.empty?

    assert_equal ["user1@example.de", "user2@example.de", "user3@example.de"], email.to
    assert_equal 'svenfuchs/minimal#1 (62aae5f): the build has failed', email.subject

    assert_match /Duration : 17 minutes and 7 seconds/, email.encoded
    assert_match /Message : the commit message/,         email.encoded
    assert_match /Status : Failed/,                      email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end

  def test_finished_email_with_configured_email_address_as_string
    repository = Factory(:repository, :owner_email => 'foo@example.com')
    config = {'notifications' => {'recipients' => 'user1@example.de'}}
    build = Factory(:build, {
      :started_at  => Time.zone.local(2011, 6, 23, 15, 30, 45),
      :finished_at => Time.zone.local(2011, 6, 23, 15, 30, 52),
      :committer_email => 'bar@example.com',
      :author_email => 'baz@example.com',
      :compare_url => "https://github.com/foo/bar-baz/compare/master...develop",
      :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master",
      :config => config
    })
    email = BuildMailer.finished_email(build).deliver
    assert !ActionMailer::Base.deliveries.empty?

    assert_equal ["user1@example.de"], email.to
    assert_equal 'svenfuchs/minimal#1 (62aae5f): the build has failed', email.subject

    assert_match /Duration : 7 seconds/,         email.encoded
    assert_match /Message : the commit message/, email.encoded
    assert_match /Status : Failed/,              email.encoded
    assert_match /View the changeset : https:\/\/github.com\/foo\/bar-baz\/compare\/master\.\.\.develop/, email.encoded
    assert_match /View the full build log and details : http:\/\/localhost:3000\/svenfuchs\/minimal\/builds\/1/, email.encoded
  end
end
