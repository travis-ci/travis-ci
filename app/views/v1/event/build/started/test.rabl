object @task

attributes :id, :repository_id, :number, :started_at, :config

node(:parent_id) { @task.owner_id }

glue @task.commit do
  extends 'v1/default/commit'
end


