class CreateTasks < ActiveRecord::Migration
  MIGRATE_COLUMNS = [:number, :log, :status, :agent]

  def self.up
    create_table :tasks do |t|
      t.references :repository
      t.references :commit
      t.references :owner, :polymorphic => true

      t.string   :type
      t.string   :state
      t.string   :number
      t.text     :config
      t.integer  :status
      t.text     :log, :default => ''
      t.string   :job_id
      t.string   :agent

      t.datetime :started_at
      t.datetime :finished_at
      t.timestamps
    end

    # TODO
    #
    # Build.where('parent_id IS NOT NULL').each do |build|
    #   attributes = build.attributes.slice(*MIGRATE_COLUMNS)
    #   attributes.merge!(:repository_id => build.repository_id)
    #   build.parent.tasks.create!(attributes)
    #   build.destroy
    # end

    change_table :tasks do |t|
      t.rename :agent, :worker
    end

    change_table :builds do |t|
      t.remove *MIGRATE_COLUMNS + [:parent_id] - [:number, :status]
    end
  end

  def self.down
    change_table :builds do |t|
      t.integer  :status
      t.text     :log, :default => ''
      t.string   :worker
    end

    # TODO
    #
    # Task::Test.all do |task|
    #   attributes = task.attributes.slice(*MIGRATE_COLUMNS)
    #   task.build.matrix.create!(attributes)
    # end

    change_table :builds do |t|
      t.rename :worker, :agent
    end

    drop_table :tasks
  end
end
