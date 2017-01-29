describe('Helpers', function() {
  describe('instance', function() {
    var repository, build, view;

    beforeEach(function() {
      repository = Test.Factory.Repository.travis();
      build = Test.Factory.Build.passing();
      view = Travis.View.create({ repository: repository, build: build });
    });

    describe('properties', function() {
      describe('configKeys', function() {
        it('returns an empty array if the config is undefined', function() {
          build.set('config', null);
          expect(view.get('configKeys')).toEqual([]);
        });

        it('returns a list of config dimensions for the build matrix table', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(view.get('configKeys')).toEqual(['Rvm', 'Gemfile']);
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(view.get('configKeys')).toEqual([]);
        });
      });

      describe('configValues', function() {
        it('returns an empty array if the config is undefined', function() {
          build.set('config', null);
          expect(view.get('configValues')).toEqual([]);
        });

        it('returns a list of config dimensions for the build matrix table', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(view.get('configValues')).toEqual([['1.9.2', 'rbx'], ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x']]);
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(view.get('configValues')).toEqual([]);
        });
      });

      it('commit', function() {
        expect(view.get('commit')).toEqual('4d7621e (master)');
      });

      describe('duration', function() {
        it("returns a '-' if the build's start time is not known", function() {
          build.set('startedAt', null);
          expect(view.get('duration')).toEqual('-');
        });

        it("returns a human readable duration using the current time if the build's finished time is not known", function() {
          build.set('finishedAt', null);
          expect(view.get('duration')).toEqual('more than 24 hrs');
        });

        it("returns a human readable duration if the build's start and finished times are both known", function() {
          expect(view.get('duration')).toEqual('10 sec');
        });
      });

      describe('finishedAt', function() {
        it("returns a '-' if the build's finished time is not known", function() {
          build.set('finishedAt', null);
          expect(view.get('finishedAt')).toEqual('-');
        });

        it("returns a human readable time ago string if the build's finished time is known", function() {
          spyOn($.timeago, 'now').andReturn(new Date(Date.UTC(2011, 0, 1, 4, 0, 0)).getTime());
          expect(view.get('finishedAt')).toEqual('about 3 hours ago');
        });
      });

      describe('config', function() {
        it('returns "-" if the config is undefined', function() {
          build.set('config', null);
          expect(view.get('config')).toEqual('-');
        });

        it('returns a  displayable config string', function() {
          build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.rails-2.3.x', 'Gemfile.rails-3.x'] });
          expect(view.get('config')).toEqual('Rvm: 1.9.2, rbx, Gemfile: Gemfile.rails-2.3.x, Gemfile.rails-3.x');
        });

        it("ignores the .configured key", function() {
          build.set('config', { '.configured': true });
          expect(view.get('config')).toEqual('-');
        });
      });
    });
  });
});

