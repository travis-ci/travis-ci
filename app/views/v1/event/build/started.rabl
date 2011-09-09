build, repository = @hash.values_at(:build, :repository)

child build => :build do
  attributes :id, :repository_id, :number, :started_at, :config, :status

  glue build.commit do
    attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
  end

  code :matrix do
    build.matrix.map { |task| Travis::Renderer.hash(task, :type => :event, :template => 'build/started/test') } if build.respond_to?(:matrix)
  end
end

child repository => :repository do
  attributes :id, :last_build_id, :last_build_number, :last_build_started_at, :last_build_finished_at, :last_build_status

  node(:slug) { |repository| repository.slug }
end

