class MimicProductionDb < ActiveRecord::Migration
  def up
    remove_column :users, :oauth2_uid if column_exists?(:users, :oauth2_uid, :integer)
    remove_column :users, :oauth2_token if column_exists?(:users, :oauth2_token, :string)
    remove_column :repositories, :user_id if column_exists?(:repositories, :user_id, :integer)
  end

  def down
  end
end
