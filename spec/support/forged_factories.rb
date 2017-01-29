FactoryGirl.define do
  factory :seed_repository, :class => Repository do
    name                      { Forgery(:repository).name }
    url                       { Forgery(:repository).url }
    owner_name                { Forgery(:repository).owner_name }
    owner_email               { Forgery(:repository).owner_email }
    last_duration             { Forgery(:repository).duration }
    created_at                { Forgery(:repository).time }
    updated_at                { Forgery(:repository).time }
    after_create do |repository|
      3.times do
        Factory.create(:seed_build, :repository => repository)
      end
    end
  end

  factory :seed_commit, :class => Commit do
    commit                 { Forgery(:commit).commit }
    branch                 { Forgery(:commit).branch }
    message                { Forgery(:commit).message }
    committed_at           { Forgery(:repository).time }
    committer_name         { Forgery(:commit).commiter_name }
    committer_email        { Forgery(:commit).commiter_email }
    author_name            { Forgery(:commit).commiter_name }
    author_email           { Forgery(:commit).commiter_email }
    compare_url            { Forgery(:commit).compare_url }
  end


  factory :seed_request, :class => Request do
    token       'the-token'
  end

  factory :seed_build, :class=> Build do
    config                 { Forgery(:build).config }
    commit                 { Factory(:seed_commit) }
    started_at             { Forgery(:repository).time }
    finished_at            { Forgery(:repository).time }
    status                 { rand(2) }

    after_create do |build|
      [ :id, :number, :status, :started_at, :finished_at ].each do |entry|
        build.repository.send("last_build_#{entry.to_s}=", build.send(entry.to_s))
      end
      build.repository.save
      build.matrix.each do |task|
        Task::Test.append_log!(task.id, Forgery(:build).log )
      end
      #1.times do
      #  build.matrix<< Factory(:seed_task, :repository => build.repository, :owner_id => build.id, :owner_type => "Build")
      #end
      build.request = Factory(:seed_request, :repository => build.repository, :commit => build.commit)
    end
  end
end


