class AddTagsToBuild < ActiveRecord::Migration
  def self.up
    add_column :builds, :tags,:text
  end

  def self.down
    remove_column :builds, :tags
  end
end
