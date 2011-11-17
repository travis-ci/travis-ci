class RepositoriesChangeOwnerEmailType < ActiveRecord::Migration
  def self.up
    change_column :repositories, :owner_email, :text
  end

  def self.down
    change_column :repositories, :owner_email, :string
  end
end
