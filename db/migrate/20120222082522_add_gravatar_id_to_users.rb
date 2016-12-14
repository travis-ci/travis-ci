class AddGravatarIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :gravatar_id, :string
  end
end
