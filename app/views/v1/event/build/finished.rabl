build, repository = @hash.values_at(:build, :repository)

child build => :build do
  attributes :id, :status, :finished_at
end

child repository => :repository do
  attributes :id, :last_build_id, :last_build_number, :last_build_started_at, :last_build_finished_at

  node(:slug) { |repository| repository.slug }
end
