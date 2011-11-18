class AddCommitUnique < ActiveRecord::Migration
  def up
    add_column :commits, :unique, :boolean, :default => true
  end

  def down
    remove_column :commits, :unique
  end
end
