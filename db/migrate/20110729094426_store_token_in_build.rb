class StoreTokenInBuild < ActiveRecord::Migration
  def self.up
    add_column :builds, :token, :string
  end

  def self.down
    remove_column :builds, :token
  end
end
