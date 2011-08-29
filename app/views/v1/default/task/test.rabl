object @task

attributes :id, :repository_id, :number, :state, :status,
           :started_at, :finished_at, :config, :log

node(:parent_id)   { @task.owner_id }
node(:started_at)  { @task.started_at }  if @task.started?
node(:finished_at) { @task.finished_at } if @task.finished?

glue @task.commit do
  extends 'v1/default/commit'
end
