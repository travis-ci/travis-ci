class BuildsAddArchivedAt < ActiveRecord::Migration
  def up
    change_table :builds do |t|
      t.datetime :archived_at
    end
  end

  def down
    remove_column :builds, :archived_at
  end
end
