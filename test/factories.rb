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
end

FactoryGirl.define do
  factory :build do
    association :repository
    number '1'
    commit '62aae5f70ceee39123ef'
    branch 'master'
    message 'the commit message'
    committer_name 'Sven Fuchs'
    committer_email 'svenfuchs@artweb-design.de'
    token 'abcd'
  end
end

FactoryGirl.define do
  factory :running_build, :parent => :build do
    started_at { Time.now }
  end
end

FactoryGirl.define do
  factory :successfull_build, :parent => :build do
    status 0
    finished_at { Time.now }
  end
end

FactoryGirl.define do
  factory :broken_build, :parent => :build do
    status 1
    started_at { Time.now }
    finished_at { Time.now }
  end
end

FactoryGirl.define do
  factory :user do
    name  'Sven Fuchs'
    login 'svenfuchs'
    email 'sven@fuchs.com'
  end
end
