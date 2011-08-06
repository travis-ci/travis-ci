object @repository

attributes :id

node(:slug) { |repository| repository.slug }
