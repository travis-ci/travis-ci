FactoryGirl.define do
  factory :jasmine_repository, :class => Repository do
    id                        1
    name                      "travis-ci"
    url                       "http://github.com/travis-ci/travis-ci"
    owner_name                "travis-ci"
    owner_email               "contact@travis-ci.org"
    last_duration             100
    created_at                DateTime.parse("2011-01-01T01:00:10")
    updated_at                DateTime.parse("2011-01-01T01:00:10")
  end

  factory :jasmine_request, :class => Request do
    token                    'the-token'
  end

  factory :jasmine_build, :class=> Build do
    id                     1
    number                 1
    config                 ({"rvm"=>["1.8.7", "1.9.2"], ".configured"=>"true"})
    commit                 { Factory(:seed_commit) }
    started_at             DateTime.parse("2011-01-01T01:00:10Z")
    finished_at            DateTime.parse("2011-01-01T01:00:20Z")
    state                  "finished"
    status                 0

    after_build do |build|
      build.request = Factory(:jasmine_request, :repository => build.repository, :commit => build.commit)
      build.save
      build.reload

      [ :id, :number, :status, :started_at, :finished_at ].each do |entry|
        build.repository.send("last_build_#{entry.to_s}=", build.send(entry.to_s))
        puts build.send(entry.to_s)
      end

      build.repository.save
      build.matrix.each do |job|
        job.append_log!("'Done. Build script exited with: 0\n'")
      end
    end
  end
end
