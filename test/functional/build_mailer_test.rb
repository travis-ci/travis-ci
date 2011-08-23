require 'test_helper'

class BuildMailerTest < ActionMailer::TestCase

  test "passed build finished_email" do
    build = Factory(:successful_build)
    mail = BuildMailer.finished_email(build)
    
    assert_equal "[Passed] svenfuchs/minimal#1 (master - 62aae5f)", mail.subject
    assert_equal ["svenfuchs@artweb-design.de"], mail.to
    assert_equal ["notifications@travis-ci.org"], mail.from
    assert_match build.number, mail.body.encoded
    assert_match build.status_message, mail.body.encoded
  end
  
  test "broken build finished email" do
    build = Factory(:broken_build)
    mail = BuildMailer.finished_email(build)
    
    assert_equal "[Failed] svenfuchs/minimal#1 (master - 62aae5f)", mail.subject
    assert_equal ["svenfuchs@artweb-design.de"], mail.to
    assert_equal ["notifications@travis-ci.org"], mail.from
    assert_match build.number, mail.body.encoded
    assert_match build.status_message, mail.body.encoded
  end

end
