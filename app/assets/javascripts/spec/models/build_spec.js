describe('Build', function() {
  describe('class methods', function() {
    describe('byRepositoryId', function() {
      it('requests GET /repositories.json', function() {
        Travis.Build.byRepositoryId(1);
        expect(mostRecentAjaxRequest().url).toEqual('/repositories/1/builds.json?parent_id=&bare=true');
      });
    });

    describe('createOrUpdate', function() {
      it('calls createOrUpdate for each of the matrix builds, too', function() {
        var build = Travis.Build.createOrUpdate({ id: 99, number: '1', matrix: [{ id: 2, number: '1.1' }]});
        build = Travis.Build.find(build.get('id'));

        expect(build.get('number')).toEqual(1);
        expect(build.getPath('matrix.firstObject.number')).toEqual(1.1);
      });
    });
  });

  describe('instance', function() {
    var repository, build;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Build.passing();
    });

    describe('attributes', function() {
      it('repositoryId', function() {
        expect(build.get('repositoryId')).toEqual(1);
      });

      it('config', function() {
        expect(build.get('config')).toEqual({ '.configured': 'true' });
      });

      it('number', function() {
        expect(build.get('number')).toEqual(1);
      });

      it('state', function() {
        expect(build.get('state')).toEqual('finished');
      });

      it('commit', function() {
        expect(build.get('commit')).toEqual('4d7621e08e1c34e94ad9');
      });

      it('branch', function() {
        expect(build.get('branch')).toEqual('master');
      });

      it('message', function() {
        expect(build.get('message')).toEqual('correct rules');
      });

      it('startedAt', function() {
        expect(build.get('startedAt')).toEqual('2011-01-01T01:00:10Z');
      });

      it('finishedAt', function() {
        expect(build.get('finishedAt')).toEqual('2011-01-01T01:00:20Z');
      });

      it('result', function() {
        expect(build.get('result')).toEqual(0);
      });

      it('committedAt', function() {
        expect(build.get('committedAt')).toEqual('2011-01-01T01:00:00Z');
      });

      it('committerName', function() {
        expect(build.get('committerName')).toEqual('Josh Kalderimis');
      });

      it('committerEmail', function() {
        expect(build.get('committerEmail')).toEqual('josh.kalderimis@gmail.com');
      });

      it('authorName', function() {
        expect(build.get('authorName')).toEqual('Alex P');
      });

      it('authorEmail', function() {
        expect(build.get('authorEmail')).toEqual('alexp@coffeenco.de');
      });

      it('compareUrl', function() {
        expect(build.get('compareUrl')).toEqual('https://github.com/travis-ci/travis-ci/compare/fe64573...3d1e844');
      });
    });

    describe('associations', function() {
      it('has many tests as a matrix', function() {
        expect(build.get('matrix').objectAt(0).get('number')).toEqual(1.1); // what's a better way to test this? is there something like className in sc 2?
      });

      it('belongs to a repository', function() {
        var _repository = build.get('repository');
        whenReady(_repository, function() {
          expect(_repository.get('slug')).toEqual(repository.get('slug'));
        })
      });
    });

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the last build has passed', function() {
          build.set('result', 0);
          expect(build.get('color')).toEqual('green');
        });

        it('returns "red" if the last build has failed', function() {
          build.set('result', 1);
          expect(build.get('color')).toEqual('red');
        });

        it('returns undefined if the last build result is unknown', function() {
          build.set('result', null);
          expect(build.get('color')).toEqual(undefined);
        });
      });

      it('appendLog', function() {
        build.set('log', 'test-1');
        build.appendLog('test-2');
        expect(build.get('log')).toEqual('test-1test-2');
      });
    });
  });
});
