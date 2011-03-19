require 'test_helper_rails'

class BuildMailerTest < ActionMailer::TestCase
  def test_finished_email
    build = Factory(:build, :committer_email => "chunkybacon@example.com", :log => "From git://github.com/bai/travis\n  f4822cb..8947caa  master     -> origin/master")
    email = BuildMailer.finished_email(build).deliver
    assert !ActionMailer::Base.deliveries.empty?

    assert_equal [ build.committer_email ], email.to
    assert_equal "svenfuchs/minimal#1 (62aae5f): the build has failed", email.subject
    assert_match /master     -> origin\/master/, email.encoded
  end
end
