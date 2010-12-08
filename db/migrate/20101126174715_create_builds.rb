class CreateBuilds < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.references :repository
      t.integer  :number
      t.integer  :status
      t.string   :commit
      t.text     :message
      t.integer  :duration
      t.text     :log
      t.string   :agent
      t.datetime :finished_at
      t.timestamps
    end
  end

  def self.down
    drop_table :builds
  end

end
