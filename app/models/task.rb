class Task < ActiveRecord::Base
  include SimpleStates

  belongs_to :owner, :polymorphic => true, :autosave => true

  validates :owner_id, :owner_type, :presence => true

  def propagate(*args)
    owner.send(*args)
  end
end
