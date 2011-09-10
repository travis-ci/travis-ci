describe('Views:', function() {
  describe('builds', function() {
    describe('show', function() {
      var tabs, build, view;

      beforeEach(function() {
        build = Test.Factory.Build.passing();
        view = createView('#main', { content: build, template: 'app/templates/builds/show' });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows the current build', function() {
        expect(view.$()).toShowBuildSummary(build);
      });

      describe('when a build property changes', function() {
        it('updates the number', function() {
          SC.run(function() { build.set('number', '111'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the duration and finished_at time', function() {
          SC.run(function() { build.set('finishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the commit', function() {
          SC.run(function() { build.set('commit', 'abcdefgh'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the branch', function() {
          SC.run(function() { build.set('branch', 'feature-ponies'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the author name', function() {
          SC.run(function() { build.set('authorName', 'Yukihiro Matsumoto'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the author email', function() {
          SC.run(function() { build.set('authorEmail', 'matz@ruby-lang.org'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the committer name', function() {
          SC.run(function() { build.set('committerName', 'Yukihiro Matsumoto'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the committer email', function() {
          SC.run(function() { build.set('committerEmail', 'matz@ruby-lang.org'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the message', function() {
          SC.run(function() { build.set('message', 'OMG PONIES!'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the config', function() {
          SC.run(function() { build.set('config', { rvm: ['rbx'], gemfile: ['Gemfile.ponies'] }); });
          expect(view.$()).toShowBuildSummary(build);
        });
      });

      describe('with a multi-build matrix', function() {
        it('renders the matrix view', function() {
          SC.run(function() {
            var attributes = build.get('matrix').objectAt(0).get('attributes');
            Travis.store.loadRecord(Travis.Build, $.merge(attributes, { id: 111, parent_id: build.get('id') }));
            // build.get('matrix').pushObject(Travis.store.find(Travis.Build, 111));
          });
          // TODO can't get the matrix to update here :/
        });
      });

      describe('with a single-build matrix', function() {
        it('renders the log', function() {
          // spyOn(Travis.Log, 'filter').andCallFake(function(log) { return log; });
          expect(view.$('pre.log')).toHaveText('1Done. Build script exited with: 0')
        });
      });
    });
  });
});
