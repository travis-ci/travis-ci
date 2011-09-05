describe('Views:', function() {
  describe('repositories', function() {
    describe('list', function() {
      var repositories, view;

      beforeEach(function() {
        $('#tab_recent .tab').empty();

        repositories = Test.Factory.Repository.latest();
        view = SC.View.create({ template: SC.TEMPLATES['app/templates/repositories/list'] });

        SC.run(function() { view.appendTo('#tab_recent .tab'); });
        SC.run(function() { view.set('content', repositories); });
      });

      afterEach(function() {
        view.destroy();
      });

      it('lists repositories', function() {
        expect(view.$()).toListRepositories(repositories);
      });

      describe('when a repository property changes', function() {
        it('updates the slug', function() {
          SC.run(function() { repositories.objectAt(0).set('slug', 'updated/slug'); });
          expect(view.$()).toListRepositories(repositories);
        });

        it('updates the last build number', function() {
          SC.run(function() { repositories.objectAt(0).set('lastBuildNumber', '111'); });
          expect(view.$()).toListRepositories(repositories);
        });

        it('updates the last build duration and last build finished_at time', function() {
          SC.run(function() { repositories.objectAt(0).set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toListRepositories(repositories);
        });

        it('updates the last build url', function() {
          SC.run(function() { repositories.objectAt(0).set('lastBuildId', 111); });
          expect(view.$()).toListRepositories(repositories);
        });
      });

      describe('when a new repository is pushed to the collection', function() {
        it('adds a list item to the top', function() {
          SC.run(function() { cookbooks = Test.Factory.Repository.cookbooks() });
          expect(view.$('li:first-child a.slug')).toHaveText('travis-ci/travis-cookbooks');
        });
      });
    });
  });
});
