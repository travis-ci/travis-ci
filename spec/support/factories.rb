Factory.define :repository do |f|
  f.name 'minimal'
  f.owner_name 'svenfuchs'
  f.owner_email 'svenfuchs@artweb-design.de'
  f.url  { |r| "http://github.com/#{r.owner_name}/#{r.name}" }
  f.last_duration 60
  f.created_at { |r| Time.utc(2011, 01, 30, 5, 25) }
  f.updated_at { |r| r.created_at + 5.minutes }
end

Factory.define :minimal, :parent => :repository do
end

Factory.define :enginex, :class => Repository do |f|
  f.name 'enginex'
  f.owner_name 'josevalim'
  f.last_duration 30
end

Factory.define :request do |f|
  f.repository { Repository.first || Factory(:repository) }
  f.association :commit
  f.token 'the-token'
end

Factory.define :commit do |f|
  f.commit '62aae5f70ceee39123ef'
  f.branch 'master'
  f.message 'the commit message'
  f.committed_at { Time.now }
  f.committer_name 'Sven Fuchs'
  f.committer_email 'svenfuchs@artweb-design.de'
  f.author_name 'Sven Fuchs'
  f.author_email 'svenfuchs@artweb-design.de'
  f.compare_url 'https://github.com/svenfuchs/minimal/compare/master...develop'
end

Factory.define :build do |f|
  f.repository { Repository.first || Factory(:repository) }
  f.association :request
  f.association :commit
end

Factory.define :running_build, :parent => :build do |f|
  f.started_at { Time.now }
end

Factory.define :successfull_build, :parent => :build do |f|
  f.status 0
  f.finished_at { Time.now }
end

Factory.define :broken_build, :parent => :build do |f|
  f.status 1
  f.started_at { Time.now }
  f.finished_at { Time.now }
end

Factory.define :user do |f|
  f.name  'Sven Fuchs'
  f.login 'svenfuchs'
  f.email 'sven@fuchs.com'
end

