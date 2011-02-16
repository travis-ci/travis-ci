describe('Json API', function() {
  it('should have initial repository data seeded', function() {
    expectRepositoryMinimal(INIT_DATA.repositories[0]);
    expectRepositoryEnginex(INIT_DATA.repositories[1]);
  });

  it('should return repositories data', function() {
    $.get('/repositories.json', function(repositories) {
      expectRepositoryMinimal(repositories[0]);
      expectRepositoryEnginex(repositories[1]);
    });
  });

  it('should return repository data', function() {
    $.get('repositories/' + INIT_DATA.repositories[0].id + '.json', function(repository) {
      expectRepositoryMinimal(repository);
    });
  });

  it('should return build data', function() {
    var repository = INIT_DATA.repositories[1];
    var url = 'repositories/' + repository.id + '/builds/' + repository.last_build.id + '.json';
    var build = null;
    $.get(url, function(response) { build = response; });

    runsWhen(function() { return !!build; }, function() {
      expect(build.number).toEqual(1);
      expect(build.started_at).toEqual('2010-11-11T12:00:00Z');
      expect(build.finished_at).toEqual('2010-11-11T12:00:20Z');
      expect(build.log).toEqual('enginex build 1 log ...');

      expect(build.commit).toEqual('565294c');
      expect(build.message).toEqual('Update Capybara');
      expect(build.committed_at).toEqual('2010-11-11T11:58:00Z');
      expect(build.committer_name).toEqual('Jose Valim');
      expect(build.committer_email).toEqual('jose@email.com');

      expect(build.repository.name).toEqual('josevalim/enginex');
      expect(build.repository.url).toEqual('https://github.com/josevalim/enginex');
      expect(build.repository.last_duration).toEqual(30);
    });
  });

  function expectRepositoryMinimal(repository) {
    expect(repository.name).toEqual('svenfuchs/minimal');
    expect(repository.last_build.number).toEqual(3);
    expect(repository.last_build.started_at).toBeDefined();
  }

  function expectRepositoryEnginex(repository) {
    expect(repository.name).toEqual('josevalim/enginex');
    expect(repository.last_build.number).toEqual(1);
    expect(repository.last_build.started_at).toBeDefined();
  }
});
