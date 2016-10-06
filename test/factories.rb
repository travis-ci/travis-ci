FactoryGirl.define do
  factory :repository do
    name 'minimal'
    owner_name 'svenfuchs'
    owner_email 'svenfuchs@artweb-design.de'
    url  { "http://github.com/#{owner_name}/#{name}" }
    last_duration 60
    last_built_at { Time.utc(2011, 01, 30, 5, 30) }
    created_at    { last_built_at - 5.minutes }
    updated_at    { last_built_at }
  end

  factory :build do
    repository { Repository.first || Factory(:repository) }
    number '1'
    commit '62aae5f70ceee39123ef'
    branch 'master'
    message 'the commit message'
    committer_name 'Sven Fuchs'
    committer_email 'svenfuchs@artweb-design.de'
  end

  factory :running_build, :parent => :build do
    started_at { Time.now }
  end

  factory :successfull_build, :parent => :build do
    status 0
    finished_at { Time.now }
  end

  factory :broken_build, :parent => :build do
    status 1
    started_at { Time.now }
    finished_at { Time.now }
  end

  factory :user do
    name  'Sven Fuchs'
    login 'svenfuchs'
    email 'sven@fuchs.com'
  end
end
