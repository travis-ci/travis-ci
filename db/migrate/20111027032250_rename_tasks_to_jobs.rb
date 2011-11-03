class RenameTasksToJobs < ActiveRecord::Migration
  def up
    rename_table :tasks, :jobs

    execute "UPDATE jobs SET type = 'Job::Test' WHERE type = 'Task::Test'"
    execute "UPDATE jobs SET type = 'Job::Configure' WHERE type = 'Task::Configure'"
  end

  def down
    rename_table :jobs, :tasks rescue nil

    execute "UPDATE tasks SET type = 'Task::Test' WHERE type = 'Job::Test'"
    execute "UPDATE tasks SET type = 'Task::Configure' WHERE type = 'Job::Configure'"
  end
end
