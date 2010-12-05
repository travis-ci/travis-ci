class CreateBuilds < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.references :repository
      t.integer  :number
      t.string   :commit
      t.integer  :status
      t.text     :log
      t.datetime :finished_at
      t.timestamps
    end
  end

  def self.down
    drop_table :builds
  end

end
