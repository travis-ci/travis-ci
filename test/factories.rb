Factory.define :repository do |f|
  f.name 'svenfuchs/minimal'
  f.url  { |r| "http://github.com/#{r.name}" }
end

Factory.define :build do |f|
  f.repository { Repository.first || Factory(:repository) }
  f.commit '62aae5f70ceee39123ef'
end

Factory.define :user do |f|
  f.name  'Travis'
  f.login 'travis'
  f.email 'travis@travis-ci.org'
end
