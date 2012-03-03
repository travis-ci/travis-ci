// TODO extract data and use recorded fixtures to ensure we're in sync with the app
Test.Factory = {
  Repository: {
    travis: function() {
      Travis.store.loadRecord(Travis.Repository, {
        id: '1',
        slug: 'travis-ci/travis-ci',
        last_build_id: '1',
        last_build_number: '1',
        last_build_result: '0',
        last_build_started_at: '2011-01-01T01:00:10Z',
        last_build_finished_at: '2011-01-01T01:00:20Z'
      }, 1);
      return Travis.store.find(Travis.Repository, 1);
    },
    worker: function() {
      Travis.store.loadRecord(Travis.Repository, {
        id: '2',
        slug: 'travis-ci/travis-worker',
        last_build_id: '2',
        last_build_number: '2',
        last_build_result: '0',
        last_build_started_at: '2011-01-01T02:00:10Z',
        last_build_finished_at: '2011-01-01T02:00:20Z'
      }, 2);
      return Travis.store.find(Travis.Repository, 2);
    },
    cookbooks: function() {
      Travis.store.loadRecord(Travis.Repository, {
        id: '3',
        slug: 'travis-ci/travis-cookbooks',
        last_build_id: '3',
        last_build_number: '3',
        last_build_result: '0',
        last_build_started_at: '2011-01-01T03:00:10Z',
        last_build_finished_at: '2011-01-01T03:00:20Z'
      }, 3);
      return Travis.store.find(Travis.Repository, 3);
    },
    recent: function() {
      Test.Factory.Repository.travis();
      Test.Factory.Repository.worker();
      return Travis.Repository.recent();
    }
  },
  Build: {
    byRepository: function() {
      Test.Factory.Build.passing();
      return Test.Factory.Repository.travis().get('builds');
    },
    passing: function() {
      Test.Factory.Repository.travis();
      Travis.store.loadRecord(Travis.Build, {
        id: 1,
        repository_id: 1,
        number: '1',
        state: 'finished',
        result: 0,
        started_at: '2011-01-01T01:00:10Z',
        finished_at: '2011-01-01T01:00:20Z',
        config: {
          '.configured': 'true'
        },
        commit: '4d7621e08e1c34e94ad9',
        branch: 'master',
        message: 'correct rules',
        committed_at: '2011-01-01T01:00:00Z',
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
            result: 0,
            started_at: '2011-01-01T01:00:10Z',
            finished_at: '2011-01-01T01:00:20Z',
            config: {
             '.configured': 'true'
            },
            log: 'Done. Build script exited with: 0\n',
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
      }, 1);
      return Travis.store.find(Travis.Build, 1);
    }
  },
  Job: {
    all: function() {
      Travis.store.loadRecord(Travis.Job, { id: 1, number: '', repository_id: 1 }, 1);
      Travis.store.loadRecord(Travis.Job, { id: 2, number: '', repository_id: 2 }, 2);
      Travis.store.loadRecord(Travis.Job, { id: 3, number: '1', repository_id: 1 }, 3);
      Travis.store.loadRecord(Travis.Job, { id: 4, number: '2', repository_id: 2 }, 4);
      Travis.store.loadRecord(Travis.Job, { id: 5, number: '1.1', repository_id: 1 }, 5);
      Travis.store.loadRecord(Travis.Job, { id: 6, number: '1.2', repository_id: 1 }, 6);
      Travis.store.loadRecord(Travis.Job, { id: 7, number: '2.1', repository_id: 2 }, 7);
      Travis.store.loadRecord(Travis.Job, { id: 8, number: '2.2', repository_id: 2 }, 8);
      return Travis.store.find(Travis.Job);
    },
    single : function() {
      Travis.store.loadRecord(Travis.Job, { id: 9, number: '1.9', repository_id: 1, started_at: '2011-01-01T01:00:10Z', finished_at: '2011-01-01T01:00:20Z', commit: '4d7621ea359459652268edeeb79ee59bd1709248', branch: 'master', log: 'Done. Build script exited with: 0\n', build_id: 1 }, 9);
      return Travis.store.find(Travis.Job, 9);
    }
  },
  Worker: {
    all: function() {
      Travis.store.loadRecord(Travis.Worker, { id: 'ruby1.worker.travis-ci.org:10000:ruby' }, 1);
      Travis.store.loadRecord(Travis.Worker, { id: 'ruby1.worker.travis-ci.org:10001:ruby' }, 2);
      Travis.store.loadRecord(Travis.Worker, { id: 'ruby2.worker.travis-ci.org:20000:ruby' }, 3);
      Travis.store.loadRecord(Travis.Worker, { id: 'ruby2.worker.travis-ci.org:20001:ruby' }, 4);
      return Travis.store.find(Travis.Worker);
    }
  }
};
