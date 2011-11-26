class RemoveRailsAdmin < ActiveRecord::Migration
  def up
    drop_table :rails_admin_histories
  end

  def down
    create_table 'rails_admin_histories', :force => true do |t|
      t.string   'message'
      t.string   'username'
      t.integer  'item'
      t.string   'table'
      t.integer  'month',      :limit => 2
      t.integer  'year',       :limit => 8
      t.datetime 'created_at'
      t.datetime 'updated_at'
    end

    add_index 'rails_admin_histories', ['item', 'table', 'month', 'year'], :name => 'index_histories_on_item_and_table_and_month_and_year'
  end
end
