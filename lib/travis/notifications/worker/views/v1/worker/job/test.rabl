job, repository = @hash.values_at(:job, :repository)

child job => :build do
  attributes :id, :number
  glue(job.commit) { attributes :commit, :branch }
end

child repository => :repository do
  attributes :id
  node(:slug) { |repository| repository.slug }
end

glue(job) { attribute :config }
