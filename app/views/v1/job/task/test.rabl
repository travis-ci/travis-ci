task, repository = @hash.values_at(:task, :repository)

child task => :build do
  attributes :id, :number, :config
  glue(task.commit) { attributes :commit, :branch }
end

child repository => :repository do
  attributes :id
  node(:slug) { |repository| repository.slug }
end


