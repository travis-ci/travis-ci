class AddPullRequestFieldsToRequest < ActiveRecord::Migration
  def change
    add_column :requests, :event_type, :string
    add_column :requests, :comments_url, :string
  end
end
