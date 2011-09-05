describe('Build', function() {
  describe('class methods', function() {
    describe('byRepositoryId', function() {
      it('requests GET /repositories.json', function() {
        Travis.Build.byRepositoryId(1);
        expect(mostRecentAjaxRequest().url).toEqual('/repositories/1/builds.json?parent_id=');
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
        expect(build.get('number')).toEqual('1');
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
        expect(build.get('matrix').objectAt(0).get('number')).toEqual('1.1'); // what's a better way to test this? is there something like className in sc 2?
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

        it('returns undefined if the last build status is unknown', function() {
          build.set('result', null);
          expect(build.get('color')).toEqual(undefined);
        });
      });

      describe('configDimensions', function() {
        it('returns an empty array if the config is undefined', function() {
          build.set('config', null);
          expect(build.get('configDimensions')).toEqual([]);
        });

        it('returns a list of config dimensions for the build matrix table', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(build.get('configDimensions')).toEqual(['Rvm', 'Gemfile']);
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(build.get('configDimensions')).toEqual([]);
        });
      });

      describe('configValues', function() {
        it('returns an empty array if the config is undefined', function() {
          build.set('config', null);
          expect(build.get('configValues')).toEqual([]);
        });

        it('returns a list of config dimensions for the build matrix table', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(build.get('configValues')).toEqual([['1.9.2', 'rbx'], ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x']]);
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(build.get('configValues')).toEqual([]);
        });
      });

      it('formattedCommit', function() {
        expect(build.get('formattedCommit')).toEqual('4d7621e (master)');
      });

      describe('formattedDuration', function() {
        it("returns a '-' if the build's start time is not known", function() {
          build.set('startedAt', null);
          expect(build.get('formattedDuration')).toEqual('-');
        });

        it("returns a '-' if the build's finished time is not known", function() {
          build.set('finishedAt', null);
          expect(build.get('formattedDuration')).toEqual('-');
        });

        it("returns a human readable duration if the build's start and finished times are both known", function() {
          expect(build.get('formattedDuration')).toEqual('10 sec');
        });
      });

      describe('formattedFinishedAt', function() {
        it("returns a '-' if the build's finished time is not known", function() {
          build.set('finishedAt', null);
          expect(build.get('formattedFinishedAt')).toEqual('-');
        });

        it("returns a human readable time ago string if the build's finished time is known", function() {
          spyOn($.timeago, 'now').andReturn(new Date('2011/01/01 05:00:00').getTime());
          expect(build.get('formattedFinishedAt')).toEqual('about 3 hours ago'); // TODO hmmm, some timezone difference here. is that a problem?
        });
      });

      describe('formattedConfig', function() {
        it('returns "-" if the config is undefined', function() {
          build.set('config', null);
          expect(build.get('formattedConfig')).toEqual('-');
        });

        it('returns a formatted displayable config string', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(build.get('formattedConfig')).toEqual('Rvm: 1.9.2, rbx, Gemfile: Gemfile.rails-2.3.x, Gemfile.rails-3.x');
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(build.get('formattedConfig')).toEqual('-');
        });
      });
    });
  });
});
