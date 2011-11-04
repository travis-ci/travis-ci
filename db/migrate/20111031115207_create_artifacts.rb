class CreateArtifacts < ActiveRecord::Migration
  def self.up
    create_table :artifacts do |t|
      t.string  :content
      t.integer :job_id
      t.string  :type

      t.timestamps
    end

    migrate_table :jobs, :to => :artifacts do |t|
      t.move :log, :to => :content
    end
  end

  def self.down
    change_table :jobs do |t|
      t.text :log rescue nil
    end

    migrate_table :artifacts, :to => :jobs do |t|
      t.move :content, :to => :log
    end

    drop_table :artifacts
  end
end
