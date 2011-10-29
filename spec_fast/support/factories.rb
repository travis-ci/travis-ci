require 'factory_girl'
require 'support/active_record'

FactoryGirl.define do
  factory :build do |f|
    f.repository { Repository.first || Factory(:repository) }
    f.association :request
    f.association :commit
  end

  factory :commit do |f|
    f.commit '62aae5f70ceee39123ef'
    f.branch 'master'
    f.message 'the commit message'
    f.committed_at '2011-11-11T11:11:11Z'
    f.committer_name 'Sven Fuchs'
    f.committer_email 'svenfuchs@artweb-design.de'
    f.author_name 'Sven Fuchs'
    f.author_email 'svenfuchs@artweb-design.de'
    f.compare_url 'https://github.com/svenfuchs/minimal/compare/master...develop'
  end

  factory :test, :class => 'Job::Test' do |f|
    f.repository { Factory(:repository) }
    f.commit     { Factory(:commit) }
    f.owner      { Factory(:build) }
  end

  factory :request do |f|
    f.repository { Repository.first || Factory(:repository) }
    f.association :commit
    f.token 'the-token'
  end

  factory :repository do |f|
    f.name 'minimal'
    f.owner_name 'svenfuchs'
    f.owner_email 'svenfuchs@artweb-design.de'
    f.url  { |r| "http://github.com/#{r.owner_name}/#{r.name}" }
    f.last_duration 60
    f.created_at { |r| Time.utc(2011, 01, 30, 5, 25) }
    f.updated_at { |r| r.created_at + 5.minutes }
  end

  factory :user do |f|
    f.name  'Sven Fuchs'
    f.login 'svenfuchs'
    f.email 'sven@fuchs.com'
    f.tokens { [Token.new] }
  end
end
