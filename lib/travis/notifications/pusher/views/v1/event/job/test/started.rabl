# gosh ...
job, repository = @hash.values_at(:build, :repository)
build = job.owner

child build => :build do
  attributes :id, :repository_id, :number, :started_at, :config

  glue build.commit do
    attributes :commit, :branch, :message, :committed_at, :committer_name, :committer_email, :author_name, :author_email, :compare_url
  end

  code :matrix do
    [Travis::Renderer.hash(job, :type => :event, :template => 'build/started/test', :build_dir => build_dir)]
  end
end

child repository => :repository do
  attributes :id, :last_build_id, :last_build_number, :last_build_started_at, :last_build_finished_at

  node(:slug) { |repository| repository.slug }
end
