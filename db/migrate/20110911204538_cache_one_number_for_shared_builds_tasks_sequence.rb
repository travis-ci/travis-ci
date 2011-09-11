class CacheOneNumberForSharedBuildsTasksSequence < ActiveRecord::Migration
  def up
    # From http://www.postgresql.org/docs/8.4/static/sql-createsequence.html#AEN58611
    # Unexpected results might be obtained if a cache setting greater than one
    # is used for a sequence object that will be used concurrently by multiple sessions.
    execute "ALTER SEQUENCE shared_builds_tasks_seq CACHE 1 NO MAXVALUE NO CYCLE"
  end

  def down
    execute "ALTER SEQUENCE shared_builds_tasks_seq CACHE 30"
  end
end

