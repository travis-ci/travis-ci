describe('Travis.Repository', function() {
  describe('class methods', function() {
    describe('latest', function() {
      it('requests GET /repositories.json', function() {
        jasmine.Ajax.useMock();
        Travis.Repository.latest();
        expect(mostRecentAjaxRequest().url).toEqual('/repositories.json');
      });
    });
  });

  describe('instance', function() {
    var repository;

    beforeEach(function() {
      repository = Test.Factory.repositories.travis();
    });

    describe('attributes', function() {
      it('slug', function() {
        expect(repository.get('slug')).toEqual('travis-ci/travis-ci');
      });

      it('lastBuildId', function() {
        expect(repository.get('lastBuildId')).toEqual(1);
      });

      it('lastBuildNumber', function() {
        expect(repository.get('lastBuildNumber')).toEqual('1');
      });

      it('lastBuildStatus', function() {
        expect(repository.get('lastBuildStatus')).toEqual(0);
      });

      it('lastBuildStartedAt', function() {
        expect(repository.get('lastBuildStartedAt')).toEqual('2011-01-01T03:00:10Z');
      });

      it('lastBuildFinishedAt', function() {
        expect(repository.get('lastBuildFinishedAt')).toEqual('2011-01-01T03:00:20Z');
      });
    });

    describe('associations', function() {
      it('has many builds', function() {
        jasmine.Ajax.useMock();
        var builds = repository.get('builds');
        mostRecentAjaxRequest().response({ status: 200, responseText: JSON.stringify([{ id: 1, number: '1' }]) });
        expect(builds.objectAt(0).get('number')).toEqual('1');
      });
    });

    describe('properties', function() {
      describe('color', function() {
        it('returns "green" if the last build has passed', function() {
          repository.set('lastBuildStatus', 0);
          expect(repository.get('color')).toEqual('green');
        });

        it('returns "red" if the last build has failed', function() {
          repository.set('lastBuildStatus', 1);
          expect(repository.get('color')).toEqual('red');
        });

        it('returns undefined if the last build status is unknown', function() {
          repository.set('lastBuildStatus', null);
          expect(repository.get('color')).toEqual(undefined);
        });
      });

      describe('formattedLastBuildDuration', function() {
        it("returns a '-' if the last build's start time is not known", function() {
          repository.set('lastBuildStartedAt', null);
          expect(repository.get('formattedLastBuildDuration')).toEqual('-');
        });

        it("returns a '-' if the last build's finished time is not known", function() {
          repository.set('lastBuildFinishedAt', null);
          expect(repository.get('formattedLastBuildDuration')).toEqual('-');
        });

        it("returns a human readable duration if the last build's start and finished times are both known", function() {
          expect(repository.get('formattedLastBuildDuration')).toEqual('10 sec');
        });
      });

      describe('formattedLastBuildFinishedAt', function() {
        it("returns a '-' if the last build's finished time is not known", function() {
          repository.set('lastBuildFinishedAt', null);
          expect(repository.get('formattedLastBuildDuration')).toEqual('-');
        });

        it("returns a human readable time ago string if the last build's finished time is known", function() {
          spyOn($.timeago, 'now').andReturn(new Date('2011/01/01 05:00:00').getTime());
          expect(repository.get('formattedLastBuildFinishedAt')).toEqual('about an hour ago'); // TODO hmmm, some timezone difference here. is that a problem?
        });
      });

      describe('cssClasses', function() {
        it("returns css classes including 'repository'", function() {
          expect(repository.get('cssClasses').split(' ')).toContain('repository');
        });

        it("returns css classes not including 'green' if the last build status is not known", function() {
          repository.set('lastBuildStatus', null);
          expect(repository.get('cssClasses').split(' ')).not.toContain('green');
        });

        it("returns css classes including 'green' if the last build has passed", function() {
          repository.set('lastBuildStatus', 0);
          expect(repository.get('cssClasses').split(' ')).toContain('green');
        });

        it("returns css classes including 'red' if the last build has failed", function() {
          repository.set('lastBuildStatus', 1);
          expect(repository.get('cssClasses').split(' ')).toContain('red');
        });

        it("returns css classes not including 'selected' if the repository is not currently selected", function() {
          repository.set('selected', false);
          expect(repository.get('cssClasses').split(' ')).not.toContain('selected');
        });

        it("returns css classes including 'selected' if the repository is currently selected", function() {
          repository.select();
          expect(repository.get('cssClasses').split(' ')).toContain('selected');
        });
      });
    });

    describe('methods', function() {
      describe('select', function() {
        var repositories;

        beforeEach(function() {
          repositories = Test.Factory.repositories.latest();
        });

        it('selects the given repository', function() {
          var repository = repositories.objectAt(0)
          repository.select();
          expect(repository.get('selected')).toBeTruthy();
        });

        it('deselects any other repositories in the timeline', function() {
          var travis = repositories.objectAt(0);
          var worker = repositories.objectAt(1);

          travis.select();
          worker.select();

          expect(travis.get('selected')).not.toBeTruthy();
          expect(worker.get('selected')).toBeTruthy();
        });
      });
    });
  });
});

