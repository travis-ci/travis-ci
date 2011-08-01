class CreateRequests < ActiveRecord::Migration
  def self.up
    create_table :requests do |t|
      t.references :repository
      t.text       :payload
      t.string     :state
      t.string     :commit
      t.string     :ref
      t.string     :branch
      t.string     :token
      t.text       :config
      t.string     :job_id
      t.string     :worker
      t.datetime   :started_at
      t.datetime   :finished_at
      t.timestamps
    end
  end

  def self.down
    drop_table :requests
  end
end
