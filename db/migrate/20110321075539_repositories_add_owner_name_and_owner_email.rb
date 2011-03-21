class RepositoriesAddOwnerNameAndOwnerEmail < ActiveRecord::Migration
  def self.up
    change_table :repositories do |t|
      t.string :owner_name
      t.string :owner_email
    end

    Repository.all.each do |r|
      r.update_attributes!(:owner_name => r.username)
    end

    remove_column :repositories, :username
  end

  def self.down
    change_table :repositories do |t|
      t.string :username
    end

    Repository.all.each do |r|
      r.update_attributes!(:username => r.owner_name)
    end

    remove_column :repositories, :owner_name
    remove_column :repositories, :owner_email
  end
end
