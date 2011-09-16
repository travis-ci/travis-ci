object @task

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :config, :status

node(:log)         { @task.log }         unless params[:bare]
node(:result)      { @task.status }
node(:parent_id)   { @task.owner_id }
node(:started_at)  { @task.started_at }  if @task.started?
node(:finished_at) { @task.finished_at } if @task.finished?

glue @task.commit do
  extends 'v1/default/commit'
end
