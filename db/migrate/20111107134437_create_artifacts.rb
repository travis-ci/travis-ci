require 'data_migrations'

class CreateArtifacts < ActiveRecord::Migration
  def self.up
    create_table :artifacts do |t|
      t.text    :content
      t.integer :job_id
      t.string  :type

      t.timestamps
    end

    migrate_table :jobs, :to => :artifacts do |t|
      t.move :log, :to => :content
      t.set  :type, 'Artifact::Log'
    end

    execute 'UPDATE artifacts SET job_id = id'
    execute "select setval('artifacts_id_seq', (select max(id) + 1 from artifacts));"

    add_index :artifacts, [:type, :job_id]
  end

  def self.down
    change_table :jobs do |t|
      t.text :log rescue nil
    end

    migrate_table :artifacts, :to => :jobs do |t|
      t.move :content, :to => :log rescue nil
    end

    drop_table :artifacts rescue nil
  end
end
