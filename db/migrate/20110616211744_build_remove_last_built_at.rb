class BuildRemoveLastBuiltAt < ActiveRecord::Migration
  def self.up
    change_table :repositories do |t|
      t.remove :last_built_at
    end
  end

  def self.down
    change_table :repositories do |t|
      t.datetime :last_built_at
    end
  end
end
