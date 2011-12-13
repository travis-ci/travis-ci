class RepositoriesAddLastBuildDuration < ActiveRecord::Migration
  def up
    change_table :repositories do |t|
      t.integer :last_build_duration
    end
  end

  def down
    remove_column :repositories, :last_build_duration
  end
end
