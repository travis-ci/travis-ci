class AddMissingIndexes < ActiveRecord::Migration
  def self.up
    add_index :repositories, :last_build_started_at
    add_index :repositories, [:owner_name, :name]
    add_index :builds,       [:repository_id, :parent_id, :started_at]
  end

  def self.down
    remove_index :repositories, :last_build_started_at
    remove_index :repositories, [:owner_name, :name]
    remove_index :builds,       [:repository_id, :parent_id, :started_at]
  end
end
