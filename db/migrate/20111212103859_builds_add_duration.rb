class BuildsAddDuration < ActiveRecord::Migration
  def up
    change_table :builds do |t|
      t.integer :duration
    end
  end

  def down
    remove_column :builds, :duration
  end
end
