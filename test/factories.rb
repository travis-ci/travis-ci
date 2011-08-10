Factory.define :repository do |f|
  f.name 'minimal'
  f.owner_name 'svenfuchs'
  f.owner_email 'svenfuchs@artweb-design.de'
  f.url  { |r| "http://github.com/#{r.owner_name}/#{r.name}" }
  f.last_duration 60
  f.created_at { |r| Time.utc(2011, 01, 30, 5, 25) }
  f.updated_at { |r| r.created_at + 5.minutes }
end

Factory.define :build do |f|
  f.association :repository
  f.number '1'
  f.commit '62aae5f70ceee39123ef'
  f.branch 'master'
  f.message 'the commit message'
  f.committer_name 'Sven Fuchs'
  f.committer_email 'svenfuchs@artweb-design.de'
  f.token 'abcd'
  f.started_at { |b| Time.utc(2011, 01, 30, 5, 25) }
  f.finished_at { |b| b.started_at + 5.minutes }
  f.status 0
end

Factory.define :running_build, :parent => :build do |f|
  f.started_at { Time.now }
  f.finished_at nil
  f.status nil
end

Factory.define :successful_build, :parent => :build do |f|
  f.finished_at { Time.now }
  f.status 0
end

Factory.define :broken_build, :parent => :build do |f|
  f.started_at { Time.now }
  f.finished_at { Time.now }
  f.status 1
end

Factory.define :development_branch_build, :parent => :build do |f|
  f.branch 'development'
end

Factory.define :user do |f|
  f.name  'Sven Fuchs'
  f.login 'svenfuchs'
  f.email 'sven@fuchs.com'
end

