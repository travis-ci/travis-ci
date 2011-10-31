object @job

attributes :id, :repository_id, :number, :finished_at, :log

node(:result)    { @job.status }
node(:parent_id) { @job.owner_id }

glue @job.commit do
  attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
end
