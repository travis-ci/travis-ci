require 'test_helper'

class BuildMailerTest < ActionMailer::TestCase
  attr_reader :build
  
  def setup
    @build = Factory(:successfull_build)
  end
  
  test "finished_email" do
    mail = BuildMailer.finished_email(build)
    
    assert_equal "svenfuchs/minimal#1 (master - 62aae5f): the build has passed", mail.subject
    assert_equal ["svenfuchs@artweb-design.de"], mail.to
    assert_equal ["notifications@travis-ci.org"], mail.from
    assert_match build.number, mail.body.encoded
    assert_match build.status_message, mail.body.encoded
  end
end