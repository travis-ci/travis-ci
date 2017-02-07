build, repository = @hash.values_at(:build, :repository)

child build => :build do
  attributes :id

  node(:parent_id) { build.owner_id } if build.is_a?(Task)
end

child repository => :repository do
  attributes :id
end


