class RenameTasksToJobs < ActiveRecord::Migration
  def up
    rename_table :tasks, :jobs
  end

  def down
    rename_table :jobs, :tasks
  end
end
