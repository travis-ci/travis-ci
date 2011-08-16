object @task

attributes :id, :repository_id, :number, :state, :status,
           :started_at, :finished_at, :config, :log

node(:parent_id) { @task.owner_id }

glue @task.commit do
  extends 'v1/default/commit'
end
