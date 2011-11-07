class DeviseCreateUsers < ActiveRecord::Migration
  def self.up
    create_table(:users) do |t|
      t.string :name
      t.string :login
      t.string :email
      t.timestamps
    end

    add_index :users, :login, :unique => true
  end

  def self.down
    drop_table :users
  end
end
