require 'data_migrations'

class CreateRequestsCommitsAndTasks < ActiveRecord::Migration
  def self.up
    change_table :builds do |t|
      t.references :commit
      t.references :request
      t.string :state
    end

    create_table :commits, :force => true do |t|
      t.references :repository

      t.string   :commit # would love to call this column :hash, but apparently FactoryGirl wouldn't >:/
      t.string   :ref
      t.string   :branch
      t.text     :message
      t.string   :compare_url

      t.datetime :committed_at
      t.string   :committer_name
      t.string   :committer_email
      t.string   :author_name
      t.string   :author_email

      t.timestamps
    end

    create_table :requests, :force => true do |t|
      t.references :repository
      t.references :commit

      t.string   :state
      t.string   :source
      t.text     :payload
      t.string   :token
      t.text     :config
      t.string   :commit # temp, for data migrations, so we can update the commit_id

      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end

    create_table :tasks, :force => true do |t|
      t.references :repository
      t.references :commit
      t.references :owner, :polymorphic => true

      t.string   :queue
      t.string   :type
      t.string   :state
      t.string   :number
      t.text     :config
      t.integer  :status
      t.text     :log, :default => ''
      t.string   :job_id
      t.string   :worker
      t.string   :commit # temp, for data migrations, so we can update the commit_id

      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end

    migrate_table :builds, :to => :commits do |t|
      t.copy   :repository_id, :created_at, :updated_at, :commit,
               :ref, :branch, :message, :compare_url, :committed_at,
               :committer_name, :committer_email, :author_name, :author_email
      t.remove :ref, :branch, :message, :compare_url, :committed_at,
               :committer_name, :committer_email, :author_name, :author_email
    end

    migrate_table :builds, :to => :requests do |t|
      t.copy :repository_id, :config, :created_at, :updated_at, :commit, :started_at, :finished_at
      t.move :github_payload, :token, :to => [:payload, :token]
      t.set  :state, 'finished'
      t.set  :source, 'github'
    end

    migrate_table :builds, :to => :tasks do |t|
      t.where  'parent_id IS NOT NULL OR parent_id IS NULL AND (SELECT COUNT(*) FROM builds AS children WHERE children.id = builds.id) = 0'
      t.copy   :number, :status, :started_at, :finished_at, :commit, :config, :log
      t.remove :log
      t.copy   :parent_id, :to => :owner_id
      t.set    :owner_type, 'Build'
      t.set    :type, 'Task::Test'
      t.set    :state, 'finished'
    end

    add_index :commits, :commit
    add_index :builds, :commit
    add_index :requests, :commit
    add_index :tasks, :commit

    execute 'UPDATE requests SET commit_id = (SELECT commits.id FROM commits WHERE commits.commit = requests.commit LIMIT 1)'
    execute 'UPDATE tasks SET commit_id = (SELECT commits.id FROM commits WHERE commits.commit = tasks.commit LIMIT 1)'

    execute 'DELETE FROM builds WHERE parent_id IS NOT NULL'
    execute 'UPDATE builds SET request_id = (SELECT requests.id FROM requests WHERE requests.commit = builds.commit LIMIT 1)'
    execute 'UPDATE builds SET commit_id = (SELECT commits.id FROM commits WHERE commits.commit = builds.commit LIMIT 1)'

    # execute "DROP SEQUENCE shared_builds_tasks_seq" rescue nil
    execute "CREATE SEQUENCE shared_builds_tasks_seq START WITH #{[Build.maximum(:id), (Task.maximum(:id) rescue 0)].compact.max.to_i + 1} CACHE 30"
    execute "ALTER TABLE builds ALTER COLUMN id TYPE BIGINT"
    execute "ALTER TABLE builds ALTER COLUMN id SET DEFAULT nextval('shared_builds_tasks_seq')"
    execute "ALTER TABLE tasks  ALTER COLUMN id TYPE BIGINT"
    execute "ALTER TABLE tasks  ALTER COLUMN id SET DEFAULT nextval('shared_builds_tasks_seq')"

    %w(commits requests tasks).each do |table_name|
      execute "SELECT setval('#{table_name}_id_seq', #{select_value("SELECT max(id) FROM #{table_name}").to_i + 1})"
    end

    remove_column :builds, :parent_id
    remove_column :builds, :commit
    remove_column :requests, :commit
    remove_column :tasks, :commit
  end

  def self.down
    # TODO complete this
    #
    # change_table :builds do |t|
    #   t.text     :github_payload
    #   t.string   :token

    #   t.string   :commit
    #   t.string   :ref
    #   t.string   :branch
    #   t.text     :message
    #   t.string   :compare_url

    #   t.datetime :committed_at
    #   t.string   :committer_name
    #   t.string   :committer_email
    #   t.string   :author_name
    #   t.string   :author_email

    #   t.references :parent_id
    #   t.integer  :status
    #   t.text     :log, :default => ''
    #   t.string   :worker

    #   t.remove :commit_id
    #   t.remove :request_id
    # end

    # migrate_table :commits, :to => :builds do |t|
    #   t.copy :commit, :ref, :branch, :message, :compare_url, :committed_at,
    #          :committer_name, :committer_email, :author_name, :author_email
    # end

    # migrate_table :requests, :to => :builds do |t|
    #   t.copy :token, :payload, :to => [:token, :github_payload]
    # end

    # migrate_table :tasks, :to => :builds do |t|
    #   t.copy :status, :log
    #   t.copy :owner_id, :to => :parent_id
    # end

    # drop_table :commits
    # drop_table :requests
  end
end

