describe('Views:', function() {
  describe('builds', function() {
    describe('list', function() {
      var builds, view;

      beforeEach(function() {
        $('#main').empty();
        spyOn($.timeago, 'now').andReturn(new Date('2011/01/01 05:00:00').getTime());

        builds = Test.Factory.Build.byRepository();
        view = SC.View.create({ template: SC.TEMPLATES['app/templates/builds/list'] });

        SC.run(function() { view.appendTo('#main'); });
        SC.run(function() { view.set('builds', builds); });
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
          ['1',     '4d7621e (master)', 'correct rules', '10 sec',   'about 3 hours ago'], // TODO add moar builds
        ]);
      });

      it('sets the build color class per row', function() {
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('green');
      });

      describe('when build property changes', function() {
        it('updates the color', function() {
          SC.run(function() { builds.objectAt(0).set('result', 1); });
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('red');
        });

        it('updates the number', function() {
          SC.run(function() { builds.objectAt(0).set('number', '111'); });
          expect(view.$('#builds tbody tr:first-child .number')).toHaveText('111');
        });

        it('updates the commit', function() {
          SC.run(function() { builds.objectAt(0).set('commit', 'abcdefgh'); });
          expect(view.$('#builds tbody tr:first-child .commit')).toHaveText('abcdefgh (master)');
        });

        it('updates the branch', function() {
          SC.run(function() { builds.objectAt(0).set('branch', 'feature-ponies'); });
          expect(view.$('#builds tbody tr:first-child .commit')).toHaveText('4d7621e (feature-ponies)');
        });

        it('updates the duration', function() {
          SC.run(function() { builds.objectAt(0).set('finishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .duration')).toHaveText('about 3 hours');
        });

        it('updates the finished_at time', function() {
          SC.run(function() { builds.objectAt(0).set('finishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .finished_at')).toHaveText('about an hour ago');
        });
      });
    });
  });
});
