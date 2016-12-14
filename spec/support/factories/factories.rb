require 'factory_girl'

FactoryGirl.define do
  factory :build do
    repository { Repository.first || Factory(:repository) }
    association :request
    association :commit
  end

  factory :commit do
    commit  '62aae5f70ceee39123ef'
    branch  'master'
    message 'the commit message'
    committed_at '2011-11-11T11:11:11Z'
    committer_name  'Sven Fuchs'
    committer_email 'svenfuchs@artweb-design.de'
    author_name  'Sven Fuchs'
    author_email 'svenfuchs@artweb-design.de'
    compare_url  'https://github.com/svenfuchs/minimal/compare/master...develop'
  end

  factory :test, :class => 'Job::Test' do
    repository { Repository.first || Factory(:repository) }
    commit     { Factory(:commit) }
    source     { Factory(:build) }
    log        { Factory(:log) }
    queue      "ruby"
  end

  factory :log, :class => 'Artifact::Log' do
    content '$ bundle install --pa'
  end

  factory :request do
    repository { Repository.first || Factory(:repository) }
    association :commit
    token 'the-token'
  end

  factory :repository do
    name 'minimal'
    owner_name  'svenfuchs'
    owner_email 'svenfuchs@artweb-design.de'
    url { |r| "http://github.com/#{r.owner_name}/#{r.name}" }
    last_duration 60
    created_at { |r| Time.utc(2011, 01, 30, 5, 25) }
    updated_at { |r| r.created_at + 5.minutes }
  end

  factory :minimal, :parent => :repository do
  end

  factory :enginex, :class => Repository do
    name 'enginex'
    owner_name 'josevalim'
    last_duration 30
  end

  factory :running_build, :parent => :build do
    repository { Factory(:repository, :name => 'running_build') }
    state 'started'
  end

  factory :successful_build, :parent => :build do
    repository { Factory(:repository, :name => 'successful_build', :last_build_status => 0) }
    status 0
    state 'finished'
    started_at { Time.now.utc }
    finished_at { Time.now.utc }
  end

  factory :broken_build, :parent => :build do
    repository { Factory(:repository, :name => 'broken_build', :last_build_status => 1) }
    status 1
    state 'finished'
    started_at { Time.now.utc }
    finished_at { Time.now.utc }
  end

  factory :user do
    name  'Sven Fuchs'
    login 'svenfuchs'
    email 'sven@fuchs.com'
    tokens { [Token.new] }
  end

  factory :worker do
    name  'worker-1'
    host  'ruby-1.workers.travis-ci.org'
    state :working
    last_seen_at { Time.now.utc }
  end

  factory :ssl_key do
    private_key "-----BEGIN RSA PRIVATE KEY-----\nMIICXAIBAAKBgQDGed1uxl9szL0PVE/B6v9PDso+xRHs9e9YDB8Dm+QYFDyddud1\nn1134ZY39Dxg6zNhXDGKYilHP4E9boIuvgfSADN12eD1clogX46M4oBGgUAhtr5Q\nvGLn9TEW4IbeI+nDshMJLTLethCmB6Hwm5Ld9QnRVT6U/AztOTv9eJ/xKQIDAQAB\nAoGABQ3zcq/AnF+2bN6DzXdzmwrQYbrZEwTMXJyqaYgdzfMt/ACcMmWllrj6/1/L\n7dfvjgowBMstK/BVFUBsNk6GmmoCDHFAU+BgeyyqUxyeb63+0dIDwVYx9LHTL4dr\n9a8cVyeefqc3mqB13B9NUlS40Ij4kuK6EOGP3DZwC1FQVwECQQDtBQFqgRuNdfbV\naGIcXnuMnD4BGrnFHm0IBdLYsK4ULL85gFbhEew6DTYGYlGqX1dXbXYue8F18D8i\nzqL6HOBhAkEA1l6zvLdC2t3J9UnwpkwU0jSPX4BpHH7IkrCoGRggjwtbSxJFcCKB\nRrbPFDNAwchsa2/ldXSBrFg6Y7GlwF3lyQJAaJk+6LuVZzZZ+hAYzCA+Me15x479\n0Kn+v/2h8RL3n9ungD7NGIKKV4wg/WxCUgfFScX608S1udCObFP4xJwdwQJBALtl\nwEQqBGSmXCV0xM3rVoxH7En1TG3fm2E400pUoCnMKLugtlkHoPF7X91tzJ9aoQTu\npa2e8rkBy9FY++gFbZkCQAJ46lGEXZJqcACvLX0t/+RrvmqWMxCydLFG50kOnD8b\nVNILVyUn1lYasTs4aMYr6BRtVZoCxqV5/+rkMhb1eOM=\n-----END RSA PRIVATE KEY-----\n"
    public_key  "-----BEGIN RSA PUBLIC KEY-----\nMIGJAoGBAMZ53W7GX2zMvQ9UT8Hq/08Oyj7FEez171gMHwOb5BgUPJ1253WfXXfh\nljf0PGDrM2FcMYpiKUc/gT1ugi6+B9IAM3XZ4PVyWiBfjozigEaBQCG2vlC8Yuf1\nMRbght4j6cOyEwktMt62EKYHofCbkt31CdFVPpT8DO05O/14n/EpAgMBAAE=\n-----END RSA PUBLIC KEY-----\n"
  end
end
