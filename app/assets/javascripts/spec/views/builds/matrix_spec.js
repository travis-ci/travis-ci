describe('Views:', function() {
  describe('builds', function() {
    describe('matrix', function() {
      var tabs, build, view;

      beforeEach(function() {
        spyOn($.timeago, 'now').andReturn(new Date('2011/01/01 05:00:00').getTime());

        build = Test.Factory.Build.passing();
        view = SC.View.create({ build: build, template: SC.TEMPLATES['app/templates/builds/matrix'] });

        SC.run(function() { view.appendTo('#main'); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows a list of builds', function() {
        expect(view.$()).toContain('table#builds');
      });

      it('does not render extra table header cells if the config is empty', function() {
        expect($.map(view.$('th'), function(th) { return $(th).text() })).toEqual(['Build', 'Finished', 'Duration'])
      });

      // TODO this works in the browser
      xit('renders a table header cell per config dimension', function() {
        SC.run(function() { build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.foo', 'Gemfile.bar'] }); });
        expect($.map(view.$('#builds th'), function(th) { return $(th).text().trim() })).toEqual(['Build', 'Rvm', 'Gemfile', 'Finished', 'Duration'])
      });

      it('renders a row per record', function() {
        expect(view.$('#builds')).toMatchTable([
          ['Build', 'Finished',          'Duration'],
          ['1.1',   'about 3 hours ago', '10 sec'], // TODO add moar builds
        ]);
      });

      // TODO this works in the browser
      xit('renders a row per record', function() {
        SC.run(function() { build.set('config', { rvm: ['1.9.2', 'rbx'], gemfile: ['Gemfile.foo', 'Gemfile.bar'] }); });
        expect(view.$('#builds tbody tr:first-child td:nth-child(2)')).toHaveText(['1.9.2']);
        expect(view.$('#builds tbody tr:first-child td:nth-child(3)')).toHaveText(['Gemfile.foo']);
      });

      it('sets the build color class per row', function() {
        expect(view.$('#builds tbody tr:first-child')).toHaveClass('green');
      });

      describe('when build property changes', function() {
        it('updates the color', function() {
          SC.run(function() { build.get('matrix').objectAt(0).set('result', 1); });
          expect(view.$('#builds tbody tr:first-child')).toHaveClass('red');
        });

        it('updates the number', function() {
          SC.run(function() { build.get('matrix').objectAt(0).set('number', '111.1'); });
          expect(view.$('#builds tbody tr:first-child .number')).toHaveText('111.1');
        });

        it('updates the duration', function() {
          SC.run(function() { build.get('matrix').objectAt(0).set('finishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .duration')).toHaveText('2 hrs 10 sec');
        });

        it('updates the finished_at time', function() {
          SC.run(function() { build.get('matrix').objectAt(0).set('finishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$('#builds tbody tr:first-child .finished_at')).toHaveText('about an hour ago');
        });
      });
    });
  });
});
