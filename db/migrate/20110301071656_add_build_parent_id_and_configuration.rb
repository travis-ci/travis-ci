class AddBuildParentIdAndConfiguration < ActiveRecord::Migration
  def self.up
    change_table :builds do |t|
      t.references :parent
      t.text :config
    end
    change_column :builds, :number, :string

    add_index :builds, :repository_id
    add_index :builds, :parent_id
  end

  def self.down
    change_table :builds do |t|
      t.remove :parent_id
      t.remove :config
    end
    change_column :builds, :number, :integer

    remove_index :builds, :repository_id
  end
end
