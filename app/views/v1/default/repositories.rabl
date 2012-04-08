collection @repositories

attributes :id, :name, :description, :last_build_id, :last_build_number, :last_build_started_at, :last_build_finished_at,
           :last_build_status, :last_build_language, :last_build_duration

node(:last_build_result) { |r| r.last_build_status(params) }

node(:slug) { |repository| repository.slug }

node(:branch_summary) do |r|
  res = []
  builds = r.last_finished_builds_by_branches.each do |build|
    res << {:branch => build.commit.branch,
           :status => build.status,
           :finished_at => build.finished_at,
           :started_at => build.started_at,
           :commit => build.commit.commit,
           :message => build.commit.message,
           :build_id => build.id }
  end
  res
end
