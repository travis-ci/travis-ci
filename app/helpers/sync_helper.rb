module SyncHelper
  def sync_user(user)
    unless user.is_syncing?
      publisher = Travis::Amqp::Publisher.new('sync.user')
      publisher.publish({ user_id: user.id }, type: 'sync')
      user.update_attribute(:is_syncing, true)
    end
  end
end
