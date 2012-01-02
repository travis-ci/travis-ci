describe('Views:', function() {
  describe('repositories', function() {
    describe('show', function() {
      var repository, view;

      beforeEach(function() {
        repository = Test.Factory.Repository.travis();
        view = createView('#main', { repository: repository, templateName: 'app/templates/repositories/show' });
      });

      afterEach(function() {
        view.destroy();
      });

      it('shows the current repository', function() {
        expect(view.$()).toShowRepository(repository);
      });

      describe('when a repository property changes', function() {
        it('updates the slug', function() {
          Ember.run(function() { repository.set('slug', 'updated/slug'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build number', function() {
          Ember.run(function() { repository.set('lastBuildNumber', '111'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build duration and last build finished_at time', function() {
          Ember.run(function() { repository.set('lastBuildFinishedAt', '2011-01-01T03:00:20Z'); });
          expect(view.$()).toShowRepository(repository);
        });

        it('updates the last build url', function() {
          Ember.run(function() { repository.set('lastBuildId', 111); });
          expect(view.$()).toShowRepository(repository);
        });
      });
    });
  });
});
