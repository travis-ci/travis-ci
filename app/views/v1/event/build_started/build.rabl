object @build

attributes :id, :repository_id, :number, :started_at

glue @build.commit do
  attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
end

code :matrix do
  @build.matrix.map { |task| Travis::Renderer.hash(task, :type => :event, :template => 'build_started/task/test') }
end
