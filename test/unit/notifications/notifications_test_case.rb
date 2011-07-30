require 'test_helper'
require 'travis/notifications'

class NotificationsTestCase < ActionMailer::TestCase
  def setup
    @repository = Factory(:repository, :owner_email => 'foo@example.com')
    TCPSocket.any_instance.stubs(:puts => true, :get => true, :eof? => true)
  end

  def create_build(config = nil, overriden_attributes = {})
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
    }.merge(overriden_attributes))
    build[:config] = config if config
    build
  end


end
