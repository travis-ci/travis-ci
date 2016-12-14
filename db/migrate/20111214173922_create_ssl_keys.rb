class CreateSslKeys < ActiveRecord::Migration
  def self.up
    create_table :ssl_keys do |t|
      t.integer :repository_id

      t.text    :public_key
      t.text    :private_key

      t.timestamps
    end

    add_index "ssl_keys", ["repository_id"], :name => "index_ssl_key_on_repository_id"
  end

  def self.down
    drop_table :ssl_keys
  end
end
