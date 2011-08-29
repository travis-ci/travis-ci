object @task

attributes :id, :repository_id, :number, :config

node(:parent_id) { @task.owner_id }
node(:started_at) { @task.started_at } if @task.started?

glue @task.commit do
  extends 'v1/default/commit'
end


