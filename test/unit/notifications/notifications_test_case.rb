require 'test_helper'
require 'travis/notifications'

class NotificationsTestCase < ActionMailer::TestCase
  def setup
    @repository = Factory(:repository, :owner_email => 'foo@example.com')
    TCPSocket.any_instance.stubs(:puts => true, :get => true, :eof? => true)
  end
end