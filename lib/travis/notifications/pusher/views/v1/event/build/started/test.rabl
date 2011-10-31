object @job

attributes :id, :repository_id, :number, :config

node(:parent_id) { @job.owner_id }
node(:started_at) { @job.started_at } if @job.started?

glue @job.commit do
  attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
end

