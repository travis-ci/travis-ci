object @build

attributes :id,:number, :status, :started_at, :finished_at

node(:status_message) { |build| build.status_message }

glue @build.commit do
  attributes :commit, :branch, :message, :compare_url, :committed_at, :committer_name,
    :committer_email, :author_name, :author_email
end

code :repository do
  Travis::Renderer.hash(@build.repository, :type => :webhook)
end

code :matrix do
  @build.matrix.map { |task| Travis::Renderer.hash(task) }
end
