class BuildsAddState < ActiveRecord::Migration
  def self.up
    change_table :builds do |t|
      t.string :state
    end
  end

  def self.down
    remove_column :builds, :state
  end
end
