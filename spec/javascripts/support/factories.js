// TODO extract data and use recorded fixtures to ensure we're in sync with the app
Test.Factory = {
  repositories: {
    travis: function() {
      Travis.store.loadRecord(Travis.Repository, {
        id: '1',
        slug: 'travis-ci/travis-ci',
        last_build_id: '1',
        last_build_number: '1',
        last_build_status: '0',
        last_build_started_at: '2011-01-01T03:00:10Z',
        last_build_finished_at: '2011-01-01T03:00:20Z'
      }, 1);
      return Travis.store.find(Travis.Repository).objectAt(0); // TODO should find by id!!
    },
    latest: function() {
      Travis.store.loadRecord(Travis.Repository, {
        id: '1',
        slug: 'travis-ci/travis-ci',
        last_build_id: '1',
        last_build_number: '1',
        last_build_status: '0',
        last_build_started_at: '2011-01-01T03:00:10Z',
        last_build_finished_at: '2011-01-01T03:00:20Z'
      }, 1);
      Travis.store.loadRecord(Travis.Repository, {
        id: '2',
        slug: 'travis-ci/travis-worker',
        last_build_id: '2',
        last_build_number: '1',
        last_build_status: '0',
        last_build_started_at: '2011-01-01T03:00:10Z',
        last_build_finished_at: '2011-01-01T03:00:20Z'
      }, 2);
      return Travis.store.find(Travis.Repository);
    }
  },
  builds: {
    passing: function() {
      Travis.store.loadRecord(Travis.Build, {
        id: 1,
        repository_id: 1,
        number: '1',
        state: 'finished',
        status: 0,
        started_at: '2011-01-01T03:00:10Z',
        finished_at: '2011-01-01T03:00:20Z',
        config: {
          '.configured': 'true'
        },
        commit: '4d7621e08e1c34e94ad9',
        branch: 'master',
        message: 'correct the refraction redirect rules',
        committed_at: '2011-01-01T03:00:00Z',
        committer_name: 'Josh Kalderimis',
        committer_email: 'josh.kalderimis@gmail.com',
        author_name: 'Alex P',
        author_email: 'alexp@coffeenco.de',
        compare_url: 'https://github.com/travis-ci/travis-ci/compare/fe64573...3d1e844',
        matrix: [
          {
            id: 2,
            repository_id: 1,
            number: '1.1',
            state: 'finished',
            status: 0,
            started_at: '2011-09-02T22:33:34Z',
            finished_at: '2011-09-02T22:34:18Z',
            config: {
             '.configured': 'true'
            },
            log: 'Using worker: ruby1.worker.travis-ci.org:worker-1\n\n\nDone. Build script exited with: 0\n',
            parent_id: 123126,
            commit: '3d1e844a359459652268edeeb79ee59bd1709248',
            branch: 'master',
            message: 'correct the refraction redirect rules',
            committed_at: '2011-09-02T22:33:19Z',
            committer_name: 'Josh Kalderimis',
            committer_email: 'josh.kalderimis@gmail.com',
            author_name: 'Alex P',
            author_email: 'alexp@coffeenco.de',
            compare_url: 'https://github.com/travis-ci/travis-ci/compare/fe64573...3d1e844'
          }
        ]
      });
      return Travis.store.find(Travis.Build).objectAt(0);
    }
  }
}



