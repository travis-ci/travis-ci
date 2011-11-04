object @job

attributes :id, :repository_id, :number, :state, :started_at, :finished_at, :config, :status

node(:log)         { @job.log.try(:content) || '' } unless params[:bare]
node(:result)      { @job.status }
node(:parent_id)   { @job.owner_id }
node(:started_at)  { @job.started_at }  if @job.started?
node(:finished_at) { @job.finished_at } if @job.finished?

glue @job.commit do
  attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
end

