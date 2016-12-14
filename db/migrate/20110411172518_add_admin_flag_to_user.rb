class AddAdminFlagToUser < ActiveRecord::Migration
  def self.up
    change_table(:users) do |t|
      t.boolean :is_admin, :default => false, :allow_null => false
    end

    User.reset_column_information

    if u = User.first
      u.is_admin = true
      u.save(false)
    end
  end

  def self.down
    change_table(:users) do |t|
      t.remove :is_admin
    end
  end
end
