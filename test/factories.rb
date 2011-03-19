FactoryGirl.define do
  factory :repository do
    username 'svenfuchs'
    name { "#{username}/minimal" }
    url  { "http://github.com/#{name}" }
    last_duration 60
    last_built_at { Time.utc(2011, 01, 30, 5, 30) }
    created_at    { last_built_at - 5.minutes }
    updated_at    { last_built_at }
  end

  factory :build do
    repository { Repository.first || Factory(:repository) }
    number '1'
    commit '62aae5f70ceee39123ef'
    message 'the commit message'
    committer_name 'Sven Fuchs'
    committer_email 'svenfuchs@artweb-design.de'
  end

  factory :user do
    name  'Sven Fuchs'
    login 'svenfuchs'
    email 'sven@fuchs.com'
  end
end
