module SyncHelper
  def sync_user(user)
    unless user.is_syncing?
      if Travis::Features.enabled_for_all?(:sync_via_sidekiq)
        Travis::Sidekiq::SynchronizeUser.perform_async(user_id: user.id)
      else
        publisher = Travis::Amqp::Publisher.new('sync.user')
        publisher.publish({ user_id: user.id }, type: 'sync')
      end
      user.update_column(:is_syncing, true)
    end
  rescue => error
    user.update_column(:is_syncing, false)
  end
end
