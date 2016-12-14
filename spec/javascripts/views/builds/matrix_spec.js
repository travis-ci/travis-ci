describe('Views:', function() {
  describe('builds', function() {
    describe('matrix', function() {
      var build, view;

      beforeEach(function() {
        spyOn($.timeago, 'now').andReturn(new Date(Date.UTC(2011, 0, 1, 4, 0, 0)).getTime());
        build = Test.Factory.Build.passing();
        view = createView('#main', {
          content: build,
          templateName: 'app/templates/jobs/list'
        });

      });

      afterEach(function() {
        view.destroy();
      });

      it('shows a list of builds', function() {
        expect(view.$()).toContain('table#builds');
      });

      it('does not render extra table header cells if the config is empty', function() {
        expect($.map(view.$('th'), function(th) { return $(th).text().trim() })).toEqual(['Job', 'Duration', 'Finished']);
      });

      // TODO this works in the browser
      xit('renders a table header cell per config dimension', function() {
        Ember.run(function() { build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.foo', 'Gemfile.bar'] }); });
        expect($.map(view.$('#builds th'), function(th) { return $(th).text().trim() })).toEqual(['Build', 'Rvm', 'Gemfile', 'Finished', 'Duration'])
      });

      xit('renders a row per record', function() {
        expect(view.$('#builds')).toMatchTable([
          ['Build', 'Finished',          'Duration'],
          ['1.1',   'about 3 hours ago', '10 sec'] // TODO add moar builds
        ]);
      });

      // TODO this works in the browser
      xit('renders a row per record', function() {
        Ember.run(function() { build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.foo', 'Gemfile.bar'] }); });
        expect(view.$('#builds tbody tr:first-child td:nth-child(2)')).toHaveText(['1.9.2']);
        expect(view.$('#builds tbody tr:first-child td:nth-child(3)')).toHaveText(['Gemfile.foo']);
      });

      it('sets the build color class per row', function() {
        expect(view.$('#builds tbody tr:first-child')).toHaveClass('green');
      });

      describe('when build property changes', function() {
        it('updates the color', function() {
          Ember.run(function() { build.get('matrix').objectAt(0).set('result', 1); });
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('red');
        });

        it('updates the number', function() {
          Ember.run(function() { build.get('matrix').objectAt(0).set('number', '111.1'); });
          expect(view.$('#builds tbody tr:first-child .number')).toHaveText('111.1');
        });

        it('updates the duration', function() {
          Ember.run(function() { build.get('matrix').objectAt(0).set('finished_at', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .duration')).toHaveText('2 hrs 10 sec');
        });

        it('updates the finished_at time', function() {
          Ember.run(function() { build.get('matrix').objectAt(0).set('finished_at', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .finished_at')).toHaveText('about an hour ago');
        });
      });
    });
  });
});
