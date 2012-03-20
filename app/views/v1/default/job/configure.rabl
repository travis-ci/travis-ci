object @job

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :config, :allowed_failure

node(:parent_id)   { @job.source_id }
node(:started_at)  { @job.started_at }  if @job.started?
node(:finished_at) { @job.finished_at } if @job.finished?

node(:log)         { @job.log.try(:content) || '' } unless params[:bare]

glue @job.commit do
  extends 'v1/default/commit'
end
