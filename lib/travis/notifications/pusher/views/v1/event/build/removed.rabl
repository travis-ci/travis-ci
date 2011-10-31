child @hash[:build] => :build do
  attributes :id, :number
end

child @hash[:repository] => :repository do
  attributes :id
  node(:slug) { |repository| repository.slug }
end

