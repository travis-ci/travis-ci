FactoryGirl.define do
  factory :seed_repository, :class => Repository do
    name             { Forgery(:repository).name }
    url              { Forgery(:repository).url }
    owner_name       { Forgery(:repository).owner_name }
    owner_email      { Forgery(:repository).owner_email }
    last_duration    { Forgery(:repository).duration }
    created_at       { Forgery(:repository).time }
    updated_at       { Forgery(:repository).time }
  end

  factory :seed_commit, :class => Commit do
    commit           { Forgery(:commit).commit }
    branch           { Forgery(:commit).branch }
    message          { Forgery(:commit).message }
    committed_at     { Forgery(:repository).time }
    committer_name   { Forgery(:commit).commiter_name }
    committer_email  { Forgery(:commit).commiter_email }
    author_name      { Forgery(:commit).commiter_name }
    author_email     { Forgery(:commit).commiter_email }
    compare_url      { Forgery(:commit).compare_url }
  end


  factory :seed_request, :class => Request do
    token       'the-token'
  end

  factory :seed_build, :class=> Build do
    config           { Forgery(:build).config }
    commit           { |b| Factory(:seed_commit, repository: b.repository) }
    started_at       { Forgery(:repository).time }
    finished_at      { Forgery(:repository).time }
    state            "finished"
    result           { rand(2) }

    after_build do |build|
      build.request = Factory(:seed_request, :repository => build.repository, :commit => build.commit)
      build.save
      build.reload

      [ :id, :number, :result, :started_at, :finished_at ].each do |entry|
        build.repository.send("last_build_#{entry.to_s}=", build.send(entry.to_s))
      end

      build.repository.save
      build.matrix.each do |job|
        job.append_log!(Forgery(:build).log)
      end
    end
  end
end


