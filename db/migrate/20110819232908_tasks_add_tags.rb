class TasksAddTags < ActiveRecord::Migration
  def self.up
    add_column :tasks, :tags, :text
  end

  def self.down
    remove_column :tasks, :tags
  end
end
