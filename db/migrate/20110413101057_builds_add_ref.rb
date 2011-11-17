class BuildsAddRef < ActiveRecord::Migration
  def self.up
    change_table :builds do |t|
      t.string :ref
      t.string :branch
    end
  end

  def self.down
    change_table :builds do |t|
      t.remove :ref
      t.remove :branch
    end
  end
end
