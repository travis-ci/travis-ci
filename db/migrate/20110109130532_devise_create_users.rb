class DeviseCreateUsers < ActiveRecord::Migration
  def self.up
    create_table(:users) do |t|
      t.string :name
      t.string :login
      t.string :email
      t.oauth2_authenticatable
      t.timestamps
    end

    add_index :users, :login, :unique => true
    add_index :users, :oauth2_uid, :unique => true
  end

  def self.down
    drop_table :users
  end
end
