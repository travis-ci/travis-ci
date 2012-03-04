describe('Views:', function() {
  describe('repositories', function() {
    describe('list', function() {
      var repositories, view;

      beforeEach(function() {
        repositories = Test.Factory.Repository.recent();
        view = createView('#tab_recent .tab', { repositories: repositories, templateName: 'app/templates/repositories/list' });
      });

      afterEach(function() {
        view.destroy();
      });

      it('lists repositories', function() {
        expect(view.$()).toListRepositories(repositories);
      });

      describe('when a repository property changes', function() {
        it('updates the last build number', function() {
          Ember.run(function() { repositories.objectAt(0).set('last_build_number', '111'); });
          expect(view.$()).toListRepositories(repositories);
        });

        it('updates the last build duration and last build finished_at time', function() {
          Ember.run(function() { repositories.objectAt(0).set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toListRepositories(repositories);
        });
      });

      describe('when a new repository is pushed to the collection', function() {
        it('adds a list item to the top', function() {
          Ember.run(function() { Test.Factory.Repository.cookbooks() });
          expect(view.$('li:first-child a.slug')).toHaveText('travis-ci/travis-cookbooks');
        });
      });
    });
  });
});
