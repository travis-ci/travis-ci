class AddActiveToRepositories < ActiveRecord::Migration
  def self.up
    add_column :repositories, :is_active, :boolean
  end

  def self.down
    remove_column :repositories, :is_active
  end
end
