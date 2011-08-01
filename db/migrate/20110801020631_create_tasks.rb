class CreateTasks < ActiveRecord::Migration
  def self.up
    create_table :tasks do |t|
      t.references :owner, :polymorphic => true
      t.string   :type
      t.string   :state
      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end
  end

  def self.down
    drop_table :tasks
  end
end
