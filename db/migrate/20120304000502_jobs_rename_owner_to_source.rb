class JobsRenameOwnerToSource < ActiveRecord::Migration
  def up
    change_table :jobs do |t|
      t.rename :owner_id, :source_id
      t.rename :owner_type, :source_type
    end
  end

  def down
    change_table :jobs do |t|
      t.rename :source_id, :owner_id
      t.rename :source_type, :owner_type
    end
  end
end
