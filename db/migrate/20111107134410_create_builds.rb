class CreateBuilds < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.references :repository
      t.integer    :number
      t.integer    :status
      t.datetime   :started_at
      t.datetime   :finished_at
      t.text       :log, :default => ''
      t.string     :commit
      t.text       :message
      t.datetime   :committed_at
      t.string     :committer_name
      t.string     :committer_email
      t.string     :author_name
      t.string     :author_email
      t.string     :job_id
      t.string     :agent
      t.timestamps
    end
  end

  def self.down
    drop_table :builds
  end
end
