class RepositoryRenameIsActiveToActive < ActiveRecord::Migration
  def self.up
    rename_column :repositories, :is_active, :active
  end

  def self.down
    rename_column :repositories, :active, :is_active
  end
end
