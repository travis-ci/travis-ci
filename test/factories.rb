FactoryGirl.define do
  factory :repository do
    name 'minimal'
    owner_name 'svenfuchs'
    owner_email 'svenfuchs@artweb-design.de'
    url  { |r| "http://github.com/#{r.owner_name}/#{r.name}" }
    last_duration 60
    created_at { |r| Time.utc(2011, 01, 30, 5, 25) }
    updated_at { |r| r.created_at + 5.minutes }
  end

  factory :build do
    association :repository
    number '1'
    commit '62aae5f70ceee39123ef'
    branch 'master'
    message 'the commit message'
    committer_name 'Sven Fuchs'
    committer_email 'svenfuchs@artweb-design.de'
    token 'abcd'
    started_at { |b| Time.utc(2011, 01, 30, 5, 25) }
    finished_at { |b| b.started_at + 5.minutes }
    status 0
  end

  factory :running_build, :parent => :build do
    started_at { Time.now }
    finished_at nil
    status nil
  end

  factory :successful_build, :parent => :build do
    started_at { Time.now }
    finished_at { Time.now }
    status 0
  end

  factory :broken_build, :parent => :build do
    started_at { Time.now }
    finished_at { Time.now }
    status 1
  end

  factory :development_branch_build, :parent => :build do
    branch 'development'
  end

  factory :user do
    name  'Sven Fuchs'
    login 'svenfuchs'
    email 'sven@fuchs.com'
  end
end
