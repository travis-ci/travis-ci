class AddGithubIdToUsersTable < ActiveRecord::Migration
  def self.up
    add_column :users , :github_id , :integer
    add_index :users, :github_id
  end

  def self.down
    remove_index :users , :github_id
    remove_column :users, :github_id
  end
end
