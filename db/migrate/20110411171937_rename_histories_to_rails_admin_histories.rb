class RenameHistoriesToRailsAdminHistories < ActiveRecord::Migration
  def self.up
    rename_table :histories, :rails_admin_histories
  end

  def self.down
    rename_table :rails_admin_histories, :histories
  end
end
