class Worker < ActiveRecord::Base
  class << self
    def prune
      delete_all(['last_seen_at < ?', Time.now - Travis.config.workers.prune.after])
    end
  end

  before_create do
    self.last_seen_at = Time.now
  end

  def full_name
    [host, name].join(':')
  end

  def ping!
    touch(:last_seen_at)
  end

  def set_state(state)
    update_attribute(:state, state)
  end
end
