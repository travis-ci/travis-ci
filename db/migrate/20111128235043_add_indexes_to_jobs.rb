class AddIndexesToJobs < ActiveRecord::Migration
  def self.up
    add_index(:jobs, [:queue, :state])
  end

  def self.down
    remove_index(:jobs, :column => [:queue, :state])
  end
end
