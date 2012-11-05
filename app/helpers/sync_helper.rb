module SyncHelper
  def sync_user(user)
    unless user.is_syncing?
      if Travis::Features.user_active?(:sync_via_sidekiq, user) or Travis::Features.enabled_for_all?(:sync_via_sidekiq)
        Travis.logger.info("Synchronizing via Sidekiq for user #{user.login}")
        Travis::Sidekiq::SynchronizeUser.perform_async(user.id)
      else
        Travis.logger.info("Synchronizing via AMQP for user #{user.login}")
        publisher = Travis::Amqp::Publisher.new('sync.user')
        publisher.publish({ user_id: user.id }, type: 'sync')
      end
      user.update_column(:is_syncing, true)
    end
  rescue => error
    user.update_column(:is_syncing, false)
    raise
  end
end
