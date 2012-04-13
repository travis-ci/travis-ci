object @job

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :config, :status, :worker, :sponsor

node(:log)         { @job.log.try(:content) || '' } unless params[:bare]
node(:result)      { @job.status }
node(:build_id)    { @job.source_id }
node(:started_at)  { @job.started_at }  if @job.started?
node(:finished_at) { @job.finished_at } if @job.finished?
node(:allow_failure) { @job.allow_failure } if @job.allow_failure
glue @job.commit do
  extends 'v1/default/commit'
end
