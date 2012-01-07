describe('Views:', function() {
  describe('builds', function() {
    describe('list', function() {
      var builds, view;

      beforeEach(function() {
        spyOn($.timeago, 'now').andReturn(new Date(Date.UTC(2011, 0, 1, 4, 0, 0)).getTime());

        builds = Test.Factory.Build.byRepository();
        view = createView('#main', {
                              builds: builds,
                              repositoryBinding: 'builds.repository',
                              templateName: 'app/templates/builds/list' });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows a list of builds', function() {
        expect(view.$()).toContain('table#builds');
      });

      it('renders a row per record', function() {
        expect(view.$('#builds')).toMatchTable([
          ['Build', 'Commit',           'Message',       'Duration', 'Finished'],
          ['1',     '4d7621e (master)', 'correct rules', '10 sec',   'about 3 hours ago'] // TODO add moar builds
        ]);
      });

      it('sets the build color class per row', function() {
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('green');
      });

      describe('when build property changes', function() {
        it('updates the color', function() {
          Ember.run(function() { builds.objectAt(0).set('result', 1); });
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('red');
        });

        it('updates the number', function() {
          Ember.run(function() { builds.objectAt(0).set('number', '111'); });
          expect(view.$('#builds tbody tr:first-child .number')).toHaveText('111');
        });

        it('updates the commit', function() {
          Ember.run(function() { builds.objectAt(0).set('commit', 'abcdefg'); });
          expect(view.$('#builds tbody tr:first-child .commit')).toHaveText('abcdefg (master)');
        });

        it('updates the branch', function() {
          Ember.run(function() { builds.objectAt(0).set('branch', 'feature-ponies'); });
          expect(view.$('#builds tbody tr:first-child .commit')).toHaveText('4d7621e (feature-ponies)');
        });

        it('updates the duration', function() {
          Ember.run(function() { builds.objectAt(0).set('finished_at', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .duration')).toHaveText('2 hrs 10 sec');
        });

        it('updates the finished_at time', function() {
          Ember.run(function() { builds.objectAt(0).set('finished_at', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .finished_at')).toHaveText('about an hour ago');
        });
      });
    });
  });
});
