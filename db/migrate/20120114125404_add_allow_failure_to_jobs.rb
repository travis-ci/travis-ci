class AddAllowFailureToJobs < ActiveRecord::Migration
  def self.up
    add_column :jobs, :allow_failure, :boolean, :default => false
  end

  def self.down
    remove_column :jobs, :allow_failure
  end
end
