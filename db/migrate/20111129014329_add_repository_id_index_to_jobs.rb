class AddRepositoryIdIndexToJobs < ActiveRecord::Migration
  def self.up
    add_index(:jobs, :repository_id)
  end

  def self.down
    remove_index(:jobs, :repository_id)
  end
end
