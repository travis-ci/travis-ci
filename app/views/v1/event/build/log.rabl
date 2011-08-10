build, repository = @hash.values_at(:build, :repository)

child build => :build do
  attributes :id
end

child repository => :repository do
  attributes :id
end


