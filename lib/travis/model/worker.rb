class Worker < ActiveRecord::Base
  before_create do
    self.last_seen_at = Time.now
  end

  def ping!
    touch(:last_seen_at)
  end

  def set_state(state)
    update_attribute(:state, state)
  end
end
