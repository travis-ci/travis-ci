class Task < ActiveRecord::Base
  include SimpleStates

  belongs_to :owner, :polymorphic => true

  def start
    self.started_at = Time.now
  end

  def finish(config)
    self.finished_at = Time.now
  end

  def propagate(*args)
    owner.send(*args)
    owner.save! # TODO why is this necessary here if self is saved afterwards? isn't the build dirty? won't it be saved?
  end
end
