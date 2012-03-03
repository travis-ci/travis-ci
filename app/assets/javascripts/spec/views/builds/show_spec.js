describe('Views:', function() {
  describe('builds', function() {
    var build, view;

    beforeEach(function() {
      build = Test.Factory.Build.passing();
    });

    describe('show', function() {

      beforeEach(function() {
        view = createView('#main', {
                              repository: build.get('repository'),
                              content: build,
                              templateName: 'app/templates/builds/show'
                          });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows the current build', function() {
        expect(view.$()).toShowBuildSummary(build);
      });

      describe('when a build property changes', function() {
        it('updates the number', function() {
          Ember.run(function() { build.set('number', '111'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the duration and finished_at time', function() {
          Ember.run(function() { build.set('finished_at', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the commit', function() {
          Ember.run(function() { build.set('commit', 'abcdefgh'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the branch', function() {
          Ember.run(function() { build.set('branch', 'feature-ponies'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the author name', function() {
          Ember.run(function() { build.set('authorName', 'Yukihiro Matsumoto'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the author email', function() {
          Ember.run(function() { build.set('authorEmail', 'matz@ruby-lang.org'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the committer name', function() {
          Ember.run(function() { build.set('committerName', 'Yukihiro Matsumoto'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the committer email', function() {
          Ember.run(function() { build.set('committerEmail', 'matz@ruby-lang.org'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the message', function() {
          Ember.run(function() { build.set('message', 'OMG PONIES!'); });
          expect(view.$()).toShowBuildSummary(build);
        });

        it('updates the config', function() {
          Ember.run(function() { build.set('config', { rvm: ['rbx'], gemfile: ['Gemfile.ponies'] }); });
          expect(view.$()).toShowBuildSummary(build);
        });
      });
      describe('with a single build matrix', function() {
	it('renders the log', function() {
          expect(view.$()).toShowBuildLog(build.get('matrix').objectAt(0).get('formattedLog'))
	});
      });

      describe('with a multi-build matrix', function() {
        it('renders the matrix view', function() {
	  Ember.run(function() {
            var attributes = build.get('matrix').objectAt(0).get('attributes');
	    Travis.store.loadRecord(Travis.Build, $.merge({ id: 111, parent_id: build.get('id') }, attributes));
            build.get('matrix').pushObject(Travis.store.find(Travis.Build, 1));
          });
          expect(view.$('#builds')).toExist();
        });

	//TODO add in specs for allowed_failure / required matrix views

      });
    });
  });
});
