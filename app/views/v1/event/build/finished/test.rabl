object @task

attributes :id, :repository_id, :number, :finished_at, :status, :log

node(:parent_id) { @task.owner_id }

glue @task.commit do
  extends 'v1/default/commit'
end
